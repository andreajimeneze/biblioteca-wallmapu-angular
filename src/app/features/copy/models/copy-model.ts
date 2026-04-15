import { CopyStatusModel } from "@features/copy-status/models/copy-status-model";
import { EditionWithEditorialModel } from "@features/edition/models/edition-model";

export interface CreateCopyModel {
  signature_topography: string;
  edition_id: number;
  copy_number: number;
}

export interface UpdateCopyModel extends CreateCopyModel {
  id_copy: number;
  status_id: number;
}

export interface CopyModel extends UpdateCopyModel {
  created_at: string;
  updated_at: string;
}

export interface CopyWithStatusModel {
  id_copy: number;
  signature_topography: string;
  edition_id: number;
  copy_number: number;
  barcode: string;
  created_at: string;
  updated_at: string;
  status: CopyStatusModel
}

export interface CopyAvailabilityModel {
  id_copy: number;
  signature_topography: string;
  copy_number: number;
  barcode: string;
  edition: EditionWithEditorialModel;
  status: CopyStatusModel;
  availability_status: string;
}
