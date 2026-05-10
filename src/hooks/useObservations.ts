import {UseMutationOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '@constants/queryKeys';
import {Observation, ObservationCreatePayload, ObservationUpsertPayload} from '../types/observations';
import {
  createObservation,
  deleteObservation,
  listObservations,
  updateObservation,
} from '@services/observations';
import {touchLastSync} from '@storage/index';
import {syncQueue} from '@services/syncQueue';
import {sortObservations} from '@utils/sort';
import {isNetworkError} from '@utils/network';

// Contexto salvo pelo onMutate para ser acessado no onSuccess/onError.
type CreateContext = {
  previousObservations: Observation[]; // snapshot do cache antes do optimistic update
  tempId: string;                       // ID temporário usado enquanto a API não responde
};

type DeleteContext = {
  previousObservations: Observation[];        // snapshot para rollback em caso de erro
  deletedObservation: Observation | null;     // observação removida, exposta para o caller (ex.: undo)
};

/**
 * Busca a lista de observações e mantém no cache por até 30 segundos.
 * Os dados são ordenados via `select` antes de chegar no componente.
 */
export const useObservationsQuery = () =>
  useQuery({
    queryKey: queryKeys.observations,
    queryFn: listObservations,
    staleTime: 30_000,
    select: sortObservations,
  });

/**
 * Cria uma observação com optimistic update:
 * o item aparece na lista imediatamente (com ID temporário) e é substituído
 * pelo item real assim que a API confirmar. Em caso de erro de rede, a operação
 * é enfileirada no syncQueue em vez de fazer rollback.
 *
 * `onMutate` é gerenciado internamente — o caller pode usar `onSuccess` e `onError`.
 */
export const useCreateObservationMutation = (
  options?: Omit<
    UseMutationOptions<Observation, Error, ObservationCreatePayload, CreateContext>,
    'mutationFn' | 'onMutate'
  >,
) => {
  const queryClient = useQueryClient();

  // onSuccess/onError são interceptados para adicionar lógica de cache e offline queue;
  // o restante das opções (ex.: onSettled) é repassado diretamente ao useMutation.
  const {onSuccess, onError, ...restOptions} = options ?? {};

  return useMutation<Observation, Error, ObservationCreatePayload, CreateContext>({
    ...restOptions,
    mutationFn: createObservation,
    onMutate: async payload => {
      // 1. Cancela refetches em andamento para evitar que sobrescrevam o optimistic update.
      await queryClient.cancelQueries({queryKey: queryKeys.observations});

      // 2. Salva snapshot do cache atual para possível rollback.
      const previousObservations =
        queryClient.getQueryData<Observation[]>(queryKeys.observations) ?? [];

      // 3. Aplica o optimistic update: insere o novo item com ID temporário.
      const tempId = `temp_${Date.now()}`;
      queryClient.setQueryData<Observation[]>(
        queryKeys.observations,
        sortObservations([{...payload, id: tempId}, ...previousObservations]),
      );

      // 4. Retorna contexto para uso no onSuccess/onError.
      return {previousObservations, tempId};
    },
    onSuccess: (created, variables, context) => {
      // Substitui o item temporário pelo item real retornado pela API.
      queryClient.setQueryData<Observation[]>(queryKeys.observations, cached =>
        sortObservations(
          (cached ?? []).map(obs => (obs.id === context.tempId ? created : obs)),
        ),
      );
      void touchLastSync();
      // `undefined as never`: React Query v5 removeu o 4º parâmetro dos callbacks,
      // mas UseMutationOptions ainda o exige na tipagem ao repassar para o caller.
      onSuccess?.(created, variables, context, undefined as never);
    },
    onError: (error, payload, context) => {
      if (isNetworkError(error) && context) {
        // Erro de rede → mantém o optimistic update e enfileira para sync offline.
        syncQueue.push({type: 'create', tempId: context.tempId, payload});
        onError?.(error, payload, context, undefined as never);
        return;
      }

      // Outro erro → desfaz o optimistic update (rollback para o estado anterior).
      if (context?.previousObservations) {
        queryClient.setQueryData(queryKeys.observations, context.previousObservations);
      }
      onError?.(error, payload, context, undefined as never);
    },
  });
};

/**
 * Atualiza uma observação existente. O optimistic update é feito pelo caller
 * (via `onMutate`) para permitir lógica de UI acoplada — ex.: rollback com toast.
 * Em caso de erro de rede, a operação é enfileirada no syncQueue.
 */
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

  // onSuccess/onError são interceptados para sincronizar o cache e tratar erros de rede;
  // o restante das opções (ex.: onMutate, onSettled) é repassado diretamente ao useMutation.
  const {onSuccess, onError, ...restOptions} = options ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: ({id, payload}) => updateObservation(id, payload),
    onSuccess: (updatedObservation, variables, context) => {
      // Substitui o item no cache pelo dado confirmado pela API.
      queryClient.setQueryData<Observation[]>(queryKeys.observations, cached =>
        sortObservations(
          (cached ?? []).map(obs =>
            obs.id === updatedObservation.id ? updatedObservation : obs,
          ),
        ),
      );
      void touchLastSync();
      onSuccess?.(updatedObservation, variables, context, undefined as never);
    },
    onError: (error, variables, context) => {
      if (isNetworkError(error)) {
        // Erro de rede → enfileira para sync offline; o caller trata o rollback via onSettled.
        syncQueue.push({type: 'update', id: variables.id, payload: variables.payload});
        return;
      }

      // Outro erro → repassa para o caller lidar (ex.: exibir toast de erro).
      onError?.(error, variables, context, undefined as never);
    },
  });
};

/**
 * Remove uma observação com optimistic update:
 * o item some da lista imediatamente e o caller recebe a observação removida via
 * `context.deletedObservation` no `onSuccess` para suportar o fluxo de undo.
 * Em caso de erro de rede, a operação é enfileirada no syncQueue sem rollback.
 *
 * `onMutate` é gerenciado internamente — o caller pode usar `onSuccess`, `onError` e `onSettled`.
 */
export const useDeleteObservationMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, string, DeleteContext>,
    'mutationFn' | 'onMutate'
  >,
) => {
  const queryClient = useQueryClient();

  // onSuccess/onError/onSettled são interceptados para tratar erros de rede e rollback;
  // o restante das opções é repassado diretamente ao useMutation.
  const {onError, onSettled, onSuccess, ...restOptions} = options ?? {};

  return useMutation<void, Error, string, DeleteContext>({
    ...restOptions,
    mutationFn: deleteObservation,
    onMutate: async observationId => {
      // 1. Cancela refetches em andamento para evitar que restaurem o item removido.
      await queryClient.cancelQueries({queryKey: queryKeys.observations});

      // 2. Salva snapshot do cache atual para possível rollback.
      const previousObservations =
        queryClient.getQueryData<Observation[]>(queryKeys.observations) ?? [];

      // 3. Salva a observação removida para expor no onSuccess (usado pelo fluxo de undo).
      const deletedObservation =
        previousObservations.find(obs => obs.id === observationId) ?? null;

      // 4. Aplica o optimistic update: remove o item do cache imediatamente.
      queryClient.setQueryData<Observation[]>(
        queryKeys.observations,
        previousObservations.filter(obs => obs.id !== observationId),
      );

      // 5. Retorna contexto para uso no onSuccess/onError.
      return {previousObservations, deletedObservation};
    },
    onError: (error, observationId, context) => {
      if (isNetworkError(error)) {
        // Erro de rede → mantém o optimistic update e enfileira para sync offline.
        syncQueue.push({type: 'delete', id: observationId});
        onError?.(error, observationId, context, undefined as never);
        return;
      }

      // Outro erro → desfaz o optimistic update (rollback para o estado anterior).
      if (context?.previousObservations) {
        queryClient.setQueryData(queryKeys.observations, context.previousObservations);
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
