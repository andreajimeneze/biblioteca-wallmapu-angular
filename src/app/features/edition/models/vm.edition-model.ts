export interface EditionModelVM {
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
  file?: File;
  isNewImg: boolean; 
}
