import { EditionCopyStatusModel } from "@features/edition-copy-status/models/edition-copy-status-model";

export interface EditionCopyModel {
  id_copy: number,
  barcode: string,
  signature_topography: string,
  copy_number: number,
  created_at: string,
  updated_at: string,
  edition_id: number,
  status_id: number
}

export interface CopyModel {
  id_copy: number,
  barcode: string,
  signature_topography: string,
  copy_number: number,
  edition: {
    id_edition: number,
    edition: string,
    isbn: string,
    publication_year: number,
    pages: number,
    cover_image: string,
    editorial_id: number,
    editorial_name: string
  },
  availability_status: string
}