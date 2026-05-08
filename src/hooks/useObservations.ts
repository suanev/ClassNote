import {UseMutationOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '@constants/queryKeys';
import {Observation, ObservationCreatePayload, ObservationUpsertPayload} from '../types/observations';
import {
  createObservation,
  deleteObservation,
  listObservations,
  updateObservation,
} from '@services/observations';
import {syncQueue} from '@services/syncQueue';
import {sortObservations} from '@utils/sort';
import {isNetworkError} from '@utils/network';

type CreateContext = {
  previousObservations: Observation[];
  tempId: string;
};

type DeleteContext = {
  previousObservations: Observation[];
  deletedObservation: Observation | null;
};

export const useObservationsQuery = () =>
  useQuery({
    queryKey: queryKeys.observations,
    queryFn: listObservations,
    staleTime: 30_000,
    select: sortObservations,
  });

export const useCreateObservationMutation = (
  options?: Omit<
    UseMutationOptions<Observation, Error, ObservationCreatePayload, CreateContext>,
    'mutationFn' | 'onMutate'
  >,
) => {
  const queryClient = useQueryClient();
  const {onSuccess, onError, ...restOptions} = options ?? {};

  return useMutation<Observation, Error, ObservationCreatePayload, CreateContext>({
    ...restOptions,
    mutationFn: createObservation,
    onMutate: async payload => {
      await queryClient.cancelQueries({queryKey: queryKeys.observations});
      const previousObservations =
        queryClient.getQueryData<Observation[]>(queryKeys.observations) ?? [];
      const tempId = `temp_${Date.now()}`;
      queryClient.setQueryData<Observation[]>(
        queryKeys.observations,
        sortObservations([{...payload, id: tempId}, ...previousObservations]),
      );
      return {previousObservations, tempId};
    },
    onSuccess: (created, variables, context) => {
      queryClient.setQueryData<Observation[]>(queryKeys.observations, current =>
        sortObservations(
          (current ?? []).map(item => (item.id === context.tempId ? created : item)),
        ),
      );
      onSuccess?.(created, variables, context, undefined as never);
    },
    onError: (error, payload, context) => {
      if (isNetworkError(error) && context) {
        syncQueue.push({type: 'create', tempId: context.tempId, payload});
        onError?.(error, payload, context, undefined as never);
        return;
      }
      if (context?.previousObservations) {
        queryClient.setQueryData(queryKeys.observations, context.previousObservations);
      }
      onError?.(error, payload, context, undefined as never);
    },
  });
};

export const useUpdateObservationMutation = (
  options?: Omit<
    UseMutationOptions<
      Observation,
      Error,
      {id: string; payload: ObservationUpsertPayload},
      unknown
    >,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  const {onSuccess, onError, ...restOptions} = options ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: ({id, payload}) => updateObservation(id, payload),
    onSuccess: (updatedObservation, variables, context) => {
      queryClient.setQueryData<Observation[]>(queryKeys.observations, current =>
        sortObservations(
          (current ?? []).map(item =>
            item.id === updatedObservation.id ? updatedObservation : item,
          ),
        ),
      );
      onSuccess?.(updatedObservation, variables, context, undefined as never);
    },
    onError: (error, variables, context) => {
      if (isNetworkError(error)) {
        syncQueue.push({type: 'update', id: variables.id, payload: variables.payload});
        return;
      }
      onError?.(error, variables, context, undefined as never);
    },
  });
};

export const useDeleteObservationMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, string, DeleteContext>,
    'mutationFn' | 'onMutate'
  >,
) => {
  const queryClient = useQueryClient();
  const {onError, onSettled, onSuccess, ...restOptions} = options ?? {};

  return useMutation<void, Error, string, DeleteContext>({
    ...restOptions,
    mutationFn: deleteObservation,
    onMutate: async observationId => {
      await queryClient.cancelQueries({queryKey: queryKeys.observations});
      const previousObservations =
        queryClient.getQueryData<Observation[]>(queryKeys.observations) ?? [];
      const deletedObservation =
        previousObservations.find(item => item.id === observationId) ?? null;
      queryClient.setQueryData<Observation[]>(
        queryKeys.observations,
        previousObservations.filter(item => item.id !== observationId),
      );
      return {previousObservations, deletedObservation};
    },
    onError: (error, observationId, context) => {
      if (isNetworkError(error)) {
        syncQueue.push({type: 'delete', id: observationId});
        return;
      }
      if (context?.previousObservations) {
        queryClient.setQueryData(queryKeys.observations, context.previousObservations);
      }
      onError?.(error, observationId, context, undefined as never);
    },
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context, undefined as never);
    },
    onSettled: (data, error, variables, context) => {
      onSettled?.(data, error, variables, context, undefined as never);
    },
  });
};
