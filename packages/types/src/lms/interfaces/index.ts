export type City = "akb" | "alm" | "ast";

export interface LmsUser {
  _id?: string;
  iin: string; // 12 digits
  email: string;
  passwordHash?: string;
  city: City;
  createdAt: Date;
  updatedAt: Date;
  resetToken?: string;
  refreshToken?: string;
}

export interface LmsToken {
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
}
