import { UserRoleModel } from "@features/user-role/models/user-role-model";
import { UserModel } from "@features/user/models/user-model";
import { UserStatusModel } from "@features/user-status/models/user-status-model";
import { CommuneModel } from "@features/commune/models/commune-model";

export interface UserDetailModel extends UserModel {
  commune: CommuneModel | null;
  user_role: UserRoleModel;
  user_status: UserStatusModel;
}
