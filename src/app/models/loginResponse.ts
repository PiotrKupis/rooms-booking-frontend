export interface LoginResponse {
  authToken: string;
  refreshToken: string;
  expireDate: Date;
  email: string;
  roles: Array<string>;
}
