export interface PaginationModel<T> {
  pages: number;
  items: number;
  next: string | null;
  prev: string | null;
  result: T;
}
