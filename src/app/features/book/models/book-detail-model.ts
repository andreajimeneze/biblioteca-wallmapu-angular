import { AuthorModel } from "@features/book-author/models/author-model";
import { EditorialModel } from "@features/book-editorial/models/editorial-model";
import { GenreModel } from "@features/book-genre/models/genre-model";
import { SubjectModel } from "@features/book-subject/models/subject-model";
import { EditionModel } from "@features/edition/models/edition-model";
import { BookModel } from '@features/book/models/book-model';

export interface BookDetailModel extends BookModel {
  genre: GenreModel,
  editorial: EditorialModel  
  authors: AuthorModel[]
  subjects: SubjectModel[]
  editions: EditionModel[]
}
