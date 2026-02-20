import { UserModel } from "@features/user/models/user-model";
import { Role } from "@shared/constants/roles-enum";

export type UserProfileVM = UserModel & {
  role: Role | null;
  picture: string | null;
};