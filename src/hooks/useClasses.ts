import {UseMutationOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {queryKeys} from '@constants/queryKeys';
import {createClass, deleteClass, listClasses} from '@services/classes';
import {touchLastSync} from '@storage/index';
import {isNetworkError} from '@utils/network';
import {syncQueue} from '@services/syncQueue';
import {SchoolClass, SchoolClassCreatePayload} from '../types/classes';

type DeleteClassContext = {
  previousClasses: SchoolClass[];
  deletedClass: SchoolClass | null;
};

/** Busca a lista de turmas e mantém no cache por até 30 segundos. */
export const useClassesQuery = () =>
  useQuery({
    queryKey: queryKeys.classes,
    queryFn: listClasses,
    staleTime: 30_000,
  });

/**
 * Cria uma nova turma com optimistic update.
 * Em caso de erro de rede, enfileira no syncQueue.
 */
export const useCreateClassMutation = (
  options?: Omit<
    UseMutationOptions<SchoolClass, Error, SchoolClassCreatePayload, {previousClasses: SchoolClass[]; tempId: string}>,
    'mutationFn' | 'onMutate'
  >,
) => {
  const queryClient = useQueryClient();
  const {onSuccess, onError, ...restOptions} = options ?? {};

  return useMutation<SchoolClass, Error, SchoolClassCreatePayload, {previousClasses: SchoolClass[]; tempId: string}>({
    ...restOptions,
    mutationFn: createClass,
    onMutate: async payload => {
      // 1. Cancela refetches em andamento
      await queryClient.cancelQueries({queryKey: queryKeys.classes});

      // 2. Salva snapshot para rollback
      const previousClasses = queryClient.getQueryData<SchoolClass[]>(queryKeys.classes) ?? [];

      // 3. Insere a turma com ID temporário
      const tempId = `temp_${Date.now()}`;
      queryClient.setQueryData<SchoolClass[]>(queryKeys.classes, [
        ...previousClasses,
        {...payload, id: tempId},
      ]);

      // 4. Retorna contexto
      return {previousClasses, tempId};
    },
    onSuccess: (created, variables, context) => {
      // Substitui o item temporário pelo real
      queryClient.setQueryData<SchoolClass[]>(queryKeys.classes, cached =>
        (cached ?? []).map(cls => (cls.id === context.tempId ? created : cls)),
      );
      void touchLastSync();
      onSuccess?.(created, variables, context, undefined as never);
    },
    onError: (error, payload, context) => {
      if (isNetworkError(error) && context) {
        // Erro de rede → mantém optimistic update e enfileira para sync
        syncQueue.push({type: 'create', tempId: context.tempId, payload: payload as never});
        onError?.(error, payload, context, undefined as never);
        return;
      }
      // Outro erro → rollback
      if (context?.previousClasses) {
        queryClient.setQueryData(queryKeys.classes, context.previousClasses);
      }
      onError?.(error, payload, context, undefined as never);
    },
  });
};

/**
 * Remove uma turma com optimistic update.
 * Em caso de erro de rede, enfileira no syncQueue.
 */
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
      // 1. Cancela refetches em andamento
      await queryClient.cancelQueries({queryKey: queryKeys.classes});

      // 2. Salva snapshot para rollback
      const previousClasses = queryClient.getQueryData<SchoolClass[]>(queryKeys.classes) ?? [];

      // 3. Salva a turma removida para expor no onSuccess
      const deletedClass = previousClasses.find(cls => cls.id === classId) ?? null;

      // 4. Remove do cache imediatamente
      queryClient.setQueryData<SchoolClass[]>(
        queryKeys.classes,
        previousClasses.filter(cls => cls.id !== classId),
      );

      // 5. Retorna contexto
      return {previousClasses, deletedClass};
    },
    onError: (error, classId, context) => {
      if (isNetworkError(error)) {
        // Erro de rede → enfileira para sync offline
        syncQueue.push({type: 'delete', id: classId});
        return;
      }
      // Outro erro → rollback
      if (context?.previousClasses) {
        queryClient.setQueryData(queryKeys.classes, context.previousClasses);
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
