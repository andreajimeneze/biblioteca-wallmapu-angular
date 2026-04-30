export interface CreateGenreModel {
  name: string;
}


export interface UpdateGenreModel extends CreateGenreModel {
  id_genre: number;
}


export interface GenreModel extends UpdateGenreModel{
  created_at: string;
  updated_at: string;
}
