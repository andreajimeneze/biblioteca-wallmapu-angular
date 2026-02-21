import { UserModel } from "@features/user/models/user-model";

export type UserFormVM = UserModel & {
  picture: string | null;
};
