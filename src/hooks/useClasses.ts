import {UseMutationOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {queryKeys} from '@constants/queryKeys';
import {createClass, deleteClass, listClasses} from '@services/classes';
import {
  getStoredClasses,
  setStoredClasses,
  touchLastSync,
} from '@storage/index';
import {isNetworkError} from '@utils/network';
import {syncQueue} from '@services/syncQueue';
import {SchoolClass, SchoolClassCreatePayload} from '../types/classes';

type DeleteClassContext = {
  previousClasses: SchoolClass[];
  deletedClass: SchoolClass | null;
};

type CreateClassContext = {
  previousClasses: SchoolClass[];
  tempId: string;
};

type CreateClassMutationOptions = Omit<
  UseMutationOptions<SchoolClass, Error, SchoolClassCreatePayload, CreateClassContext>,
  'mutationFn' | 'onMutate'
> & {
  onQueued?: (
    queuedClass: SchoolClass,
    variables: SchoolClassCreatePayload,
    context: CreateClassContext,
  ) => void;
};

const persistClasses = (classes: SchoolClass[]): SchoolClass[] => {
  setStoredClasses(classes);
  return classes;
};

export const useClassesQuery = () =>
  useQuery({
    queryKey: queryKeys.classes,
    queryFn: async () => {
      const classes = await listClasses();
      return persistClasses(classes);
    },
    initialData: getStoredClasses,
    initialDataUpdatedAt: 0,
    refetchOnMount: 'always',
    staleTime: 30_000,
  });

export const useCreateClassMutation = (
  options?: CreateClassMutationOptions,
) => {
  const queryClient = useQueryClient();
  const {onSuccess, onError, onQueued, ...restOptions} = options ?? {};

  return useMutation<SchoolClass, Error, SchoolClassCreatePayload, CreateClassContext>({
    ...restOptions,
    mutationFn: createClass,
    onMutate: async payload => {
      await queryClient.cancelQueries({queryKey: queryKeys.classes});
      const previousClasses = queryClient.getQueryData<SchoolClass[]>(queryKeys.classes) ?? [];
      const tempId = `temp_${Date.now()}`;
      queryClient.setQueryData<SchoolClass[]>(
        queryKeys.classes,
        persistClasses([
          ...previousClasses,
          {...payload, id: tempId},
        ]),
      );
      return {previousClasses, tempId};
    },
    onSuccess: (created, variables, context) => {
      queryClient.setQueryData<SchoolClass[]>(queryKeys.classes, cached =>
        persistClasses(
          (cached ?? []).map(cls => (cls.id === context.tempId ? created : cls)),
        ),
      );
      void touchLastSync();
      onSuccess?.(created, variables, context, undefined as never);
    },
    onError: (error, payload, context) => {
      if (isNetworkError(error) && context) {
        syncQueue.push({
          entity: 'class',
          type: 'create',
          tempId: context.tempId,
          payload,
        });
        onQueued?.({...payload, id: context.tempId}, payload, context);
        return;
      }
      if (context?.previousClasses) {
        queryClient.setQueryData(
          queryKeys.classes,
          persistClasses(context.previousClasses),
        );
      }
      onError?.(error, payload, context, undefined as never);
    },
  });
};

export const useDeleteClassMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, string, DeleteClassContext>,
    'mutationFn' | 'onMutate'
  >,
) => {
  const queryClient = useQueryClient();
  const {onError, onSuccess, onSettled, ...restOptions} = options ?? {};

  return useMutation<void, Error, string, DeleteClassContext>({
    ...restOptions,
    mutationFn: deleteClass,
    onMutate: async classId => {
      await queryClient.cancelQueries({queryKey: queryKeys.classes});
      const previousClasses = queryClient.getQueryData<SchoolClass[]>(queryKeys.classes) ?? [];
      const deletedClass = previousClasses.find(cls => cls.id === classId) ?? null;
      queryClient.setQueryData<SchoolClass[]>(
        queryKeys.classes,
        persistClasses(previousClasses.filter(cls => cls.id !== classId)),
      );
      return {previousClasses, deletedClass};
    },
    onError: (error, classId, context) => {
      if (isNetworkError(error)) {
        syncQueue.push({entity: 'class', type: 'delete', id: classId});
        return;
      }
      if (context?.previousClasses) {
        queryClient.setQueryData(
          queryKeys.classes,
          persistClasses(context.previousClasses),
        );
      }
      onError?.(error, classId, context, undefined as never);
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
