import { City } from "./index";

export interface SignupRequest {
  iin: string;
  city: City;
  email: string;
  password: string;
}
export interface SignupResponse {
  success: boolean;
  error?: string;
}

export interface SetPasswordRequest {
  iin: string;
  password: string;
}
export interface SetPasswordResponse {
  success: boolean;
  error?: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}
export interface SigninResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
export interface ForgotPasswordResponse {
  success: boolean;
  error?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
export interface ResetPasswordResponse {
  success: boolean;
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
export interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  error?: string;
}

export interface ApiError {
  error: string;
}
