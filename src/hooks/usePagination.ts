import { useCallback, useMemo, useState } from 'react';
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
