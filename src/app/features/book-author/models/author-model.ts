export interface CreateAuthorModel {
  name: string;
}


export interface UpdateAuthorModel extends CreateAuthorModel {
  id_author: number;
}


export interface AuthorModel extends UpdateAuthorModel {
  created_at: string;
  updated_at: string;
}
