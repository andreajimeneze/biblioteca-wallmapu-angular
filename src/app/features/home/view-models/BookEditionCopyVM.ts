import { EditorialModel } from "@features/book-editorial/models/editorial-model";
import { EditionCopyDetailModel } from "@features/edition-copy/models/edition-copy-detail-model";

export interface BookEditionCopyVM {
  id_edition: number,
  edition: string,
  isbn: string,
  publication_year: number,
  pages: number,
  cover_image: string | null,
  created_at: string,
  updated_at: string,
  editorial: EditorialModel,
  copy: EditionCopyDetailModel,
}