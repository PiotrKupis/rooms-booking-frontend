export interface AuthenticationResponse {
  authToken: string;
  refreshToken: string;
  expireDate: Date;
  email: string;
  role: string;
}
