export interface PaginationRequestModel<T> {
  page: number;
  limit: number;
  search?: string;
  filter?: T
}
