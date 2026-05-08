import { Observation } from '../types/observations';
import { ObservationSortOrder } from '../store/observations/slice';

/***
 * Ordena observações conforme o filtro selecionado.
 * Ex.: recent-first mostra a mais nova primeiro.
 */
export const sortObservations = (
  items: Observation[],
  sortOrder: ObservationSortOrder = 'recent-first',
): Observation[] => {
  if (sortOrder === 'old-first') {
    return [...items].sort(
      (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    );
  }

  if (sortOrder === 'favorites-first') {
    return [...items].sort((left, right) => {
      if (left.favorite !== right.favorite) {
        return Number(right.favorite) - Number(left.favorite);
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
  }

  return [...items].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
};
