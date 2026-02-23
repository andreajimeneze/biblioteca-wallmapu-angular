import { UserDetailModel } from "@features/user/models/user-detail-model";

export type UserProfileVM = UserDetailModel & {
  picture: string | null;
};