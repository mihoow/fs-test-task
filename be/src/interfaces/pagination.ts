interface IPagination {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type Paginated<T> = {
  items: T[];
  pagination: IPagination;
};
