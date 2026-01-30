export interface ApiAuthResponse {
  token: string,            // JWT de TU backend
  user: {
    id: string,
    email: string,
    name?: string,
    picture?: string,
    profileComplete: boolean,
    roles?: string
  }
}
