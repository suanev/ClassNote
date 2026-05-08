import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';

/***
 * Formata o tempo relativo de uma observação.
 * Ex.: ha 5 minutos, ha 2 dias.
 */
export const formatRelativeObservationTime = (iso: string): string =>
  formatDistanceToNow(new Date(iso), {
    addSuffix: true,
    locale: ptBR,
  });

/***
 * Formata a data da ultima sincronizacao.
 * Ex.: 07/05/2026, 08:45 ou Nunca sincronizado.
 */
export const formatLastSync = (iso: string | null): string => {
  if (!iso) {return 'Nunca sincronizado';}
  return new Date(iso).toLocaleString('pt-BR', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
};
