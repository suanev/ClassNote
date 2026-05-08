import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@constants/queryKeys';
import { listClasses } from '@services/classes';

/***
 * Busca a lista de turmas no React Query.
 * Ex.: retorna as turmas usadas na tela de classes.
 */
export const useClassesQuery = () =>
  useQuery({
    queryKey: queryKeys.classes,
    queryFn: listClasses,
    staleTime: 30_000,
  });
