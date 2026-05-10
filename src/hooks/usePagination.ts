import { useCallback, useMemo, useState } from 'react';

/***
 * Pagina uma lista local por página.
 * Ex.: com 30 itens e pageSize 10, começa mostrando só 10.
 */
export const usePagination = <T>(items: T[], pageSize = 10) => {
  const [page, setPage] = useState(1);

  const paginatedItems = useMemo(() => {
    return items.slice(0, page * pageSize);
  }, [items, page, pageSize]);

  const hasMore = paginatedItems.length < items.length;

  const loadMore = useCallback(
    () =>
      setPage(currentPage =>
        currentPage * pageSize >= items.length ? currentPage : currentPage + 1,
      ),
    [items.length, pageSize],
  );

  const reset = useCallback(() => setPage(1), []);

  return {
    page,
    pageSize,
    hasMore,
    paginatedItems,
    loadMore,
    reset,
  };
};
