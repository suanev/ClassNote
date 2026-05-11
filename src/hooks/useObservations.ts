import {UseMutationOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '@constants/queryKeys';
import {Observation, ObservationCreatePayload, ObservationUpsertPayload} from '../types/observations';
import {
  createObservation,
  deleteObservation,
  listObservations,
  updateObservation,
} from '@services/observations';
import {
  getStoredObservations,
  setStoredObservations,
  touchLastSync,
} from '@storage/index';
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

type UpdateVariables = {
  id: string;
  payload: ObservationUpsertPayload;
};

type UpdateContext = {
  previousObservations: Observation[];
  userContext: unknown;
};

type UpdateObservationMutationOptions = Omit<
  UseMutationOptions<Observation, Error, UpdateVariables, UpdateContext>,
  'mutationFn'
> & {
  onQueued?: (variables: UpdateVariables, context: UpdateContext) => void;
};

const persistObservations = (observations: Observation[]): Observation[] => {
  setStoredObservations(observations);
  return observations;
};

export const useObservationsQuery = () =>
  useQuery({
    queryKey: queryKeys.observations,
    queryFn: async () => {
      const observations = await listObservations();
      return persistObservations(sortObservations(observations));
    },
    initialData: getStoredObservations,
    initialDataUpdatedAt: 0,
    refetchOnMount: 'always',
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
        persistObservations(
          sortObservations([{...payload, id: tempId}, ...previousObservations]),
        ),
      );
      return {previousObservations, tempId};
    },
    onSuccess: (created, variables, context) => {
      queryClient.setQueryData<Observation[]>(queryKeys.observations, cached =>
        persistObservations(
          sortObservations(
            (cached ?? []).map(obs => (obs.id === context.tempId ? created : obs)),
          ),
        ),
      );
      void touchLastSync();
      onSuccess?.(created, variables, context, undefined as never);
    },
    onError: (error, payload, context) => {
      if (isNetworkError(error) && context) {
        syncQueue.push({
          entity: 'observation',
          type: 'create',
          tempId: context.tempId,
          payload,
        });
        onError?.(error, payload, context, undefined as never);
        return;
      }
      if (context?.previousObservations) {
        queryClient.setQueryData(
          queryKeys.observations,
          persistObservations(context.previousObservations),
        );
      }
      onError?.(error, payload, context, undefined as never);
    },
  });
};

export const useUpdateObservationMutation = (
  options?: UpdateObservationMutationOptions,
) => {
  const queryClient = useQueryClient();
  const {onSuccess, onError, onMutate, onQueued, ...restOptions} = options ?? {};

  return useMutation<Observation, Error, UpdateVariables, UpdateContext>({
    ...restOptions,
    mutationFn: ({id, payload}) => updateObservation(id, payload),
    onMutate: async variables => {
      await queryClient.cancelQueries({queryKey: queryKeys.observations});

      const previousObservations =
        queryClient.getQueryData<Observation[]>(queryKeys.observations) ?? [];

      queryClient.setQueryData<Observation[]>(
        queryKeys.observations,
        persistObservations(
          sortObservations(
            previousObservations.map(item =>
              item.id === variables.id ? {...item, ...variables.payload} : item,
            ),
          ),
        ),
      );

      const userContext = await onMutate?.(variables, undefined as never);

      return {
        previousObservations,
        userContext,
      };
    },
    onSuccess: (updatedObservation, variables, context) => {
      queryClient.setQueryData<Observation[]>(queryKeys.observations, cached =>
        persistObservations(
          sortObservations(
            (cached ?? []).map(obs =>
              obs.id === updatedObservation.id ? updatedObservation : obs,
            ),
          ),
        ),
      );
      void touchLastSync();
      onSuccess?.(updatedObservation, variables, context, undefined as never);
    },
    onError: (error, variables, context) => {
      if (isNetworkError(error)) {
        syncQueue.push({
          entity: 'observation',
          type: 'update',
          id: variables.id,
          payload: variables.payload,
        });
        if (context) {
          onQueued?.(variables, context);
        }
        return;
      }

      if (context?.previousObservations) {
        queryClient.setQueryData(
          queryKeys.observations,
          persistObservations(context.previousObservations),
        );
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
        previousObservations.find(obs => obs.id === observationId) ?? null;
      queryClient.setQueryData<Observation[]>(
        queryKeys.observations,
        persistObservations(previousObservations.filter(obs => obs.id !== observationId)),
      );
      return {previousObservations, deletedObservation};
    },
    onError: (error, observationId, context) => {
      if (isNetworkError(error)) {
        syncQueue.push({
          entity: 'observation',
          type: 'delete',
          id: observationId,
        });
        onError?.(error, observationId, context, undefined as never);
        return;
      }
      if (context?.previousObservations) {
        queryClient.setQueryData(
          queryKeys.observations,
          persistObservations(context.previousObservations),
        );
      }
      onError?.(error, observationId, context, undefined as never);
    },
    onSuccess: (data, variables, context) => {
      void touchLastSync();
      onSuccess?.(data, variables, context, undefined as never);
    },
    onSettled: (data, error, variables, context) => {
      onSettled?.(data, error, variables, context, undefined as never);
    },
  });
};
