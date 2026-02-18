import { AuthUser } from "./auth-user";

export interface ApiAuthGoogleResponse {
  token: string,
  user: AuthUser
}
