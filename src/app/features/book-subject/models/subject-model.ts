export interface CreateSubjectModel {
  name: string;
}


export interface UpdateSubjectModel extends CreateSubjectModel {
  id_subject: number;
}


export interface SubjectModel extends UpdateSubjectModel {
  created_at: string;
  updated_at: string;
}
