import {useMemo, useState} from 'react';

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  const paginatedItems = useMemo(() => {
    return items.slice(0, page * pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    pageSize,
    paginatedItems,
    loadMore: () => setPage(currentPage => currentPage + 1),
    reset: () => setPage(1),
  };
}
