export interface BookPaginationRequestModel {
  page: number;
  limit: number;
  search: string;
  id_author: number;
  id_editorial: number;
  id_genre: number;
}
