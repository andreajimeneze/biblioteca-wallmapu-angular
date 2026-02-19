import { UserModel } from "@features/user/models/user-model";

export type UserProfileVM = UserModel & {
  picture: string | null;
};