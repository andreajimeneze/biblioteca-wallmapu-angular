import { EditionCopyModel } from "@features/edition-copy/models/edition-copy-model"

export interface EditionModel {
  id_edition: number,
  edition: string,
  isbn: string,
  publication_year: number,
  pages: number,
  cover_image: string | null,
  created_at: string,
  updated_at: string,
  book_id: number,
  editorial_id: number
  copies: EditionCopyModel[]
}
