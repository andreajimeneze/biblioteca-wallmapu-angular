import { Role } from "@shared/constants/roles-enum";

export interface AuthUser {
  id_user: string,
  email: string,
  name?: string,
  picture?: string,
  profileComplete: boolean,
  role: Role,
}
