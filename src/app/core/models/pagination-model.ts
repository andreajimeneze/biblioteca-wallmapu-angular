export interface PaginationModel<T> {
  page: number;
  pages: number;
  items: number;
  next: string | null;
  prev: string | null;
  result: T;
}
