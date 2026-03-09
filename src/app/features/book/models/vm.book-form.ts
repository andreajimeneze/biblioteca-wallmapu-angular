import { BookModel } from "./book-model";

export type BookFormVM = BookModel & {
  editorial_id: number,
  authors_id: number[],
  subjects_id: number[],
};