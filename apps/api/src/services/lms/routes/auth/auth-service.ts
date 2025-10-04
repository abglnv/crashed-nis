// Service functions: handle DB, tokens, email, etc.
import { connectDb, getTokenCollection, getUserCollection } from "../../../../db";
import { LmsUser, City } from "@repo/types/lms/interfaces";
import {
  SignupRequest,
  SignupResponse,
  SetPasswordRequest,
  SetPasswordResponse,
  SigninRequest,
  SigninResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse
} from "@repo/types/lms/interfaces/requests";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "../../../../config";

const signupSchema = z.object({
  iin: z.string().length(12),
  city: z.enum(["akb", "alm", "ast"]),
  email: z.string().email(),
  password: z.string().min(6)
});
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const parse = signupSchema.safeParse(data);
  if (!parse.success) return { success: false, error: "Invalid signup data" };
  await connectDb();
  const users = getUserCollection();
  const existing = await users.findOne({ iin: data.iin });
  if (existing) return { success: false, error: "User already exists" };
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user: LmsUser = {
    iin: data.iin,
    city: data.city,
    email: data.email,
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await users.insertOne(user);
  return { success: true };
}

const setPasswordSchema = z.object({
  iin: z.string().length(12),
  password: z.string().min(6)
});
export async function setPassword(data: SetPasswordRequest): Promise<SetPasswordResponse> {
  const parse = setPasswordSchema.safeParse(data);
  if (!parse.success) return { success: false, error: "Missing data" };
  await connectDb();
  const users = getUserCollection();
  const user = await users.findOne({ iin: data.iin });
  if (!user) return { success: false, error: "User not found" };
  const passwordHash = await bcrypt.hash(data.password, 10);
  await users.updateOne({ iin: data.iin }, { $set: { passwordHash, updatedAt: new Date() } });
  return { success: true };
}

const JWT_SECRET = env.JWT_SECRET
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
export async function signin(data: SigninRequest): Promise<SigninResponse> {
  const parse = signinSchema.safeParse(data);
  if (!parse.success) return { success: false, error: "Missing data" };
  await connectDb();
  const users = getUserCollection();
  const user = await users.findOne({ email: data.email });
  if (!user || !user.passwordHash) return { success: false, error: "Invalid credentials" };
  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) return { success: false, error: "Invalid credentials" };
  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
  const tokens = getTokenCollection();
  await tokens.insertOne({ userId: user._id, accessToken, refreshToken, createdAt: new Date(), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  return { success: true, accessToken, refreshToken };
}

const forgotPasswordSchema = z.object({
  email: z.string().email()
});
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const parse = forgotPasswordSchema.safeParse(data);
  if (!parse.success) return { success: false, error: "Missing email" };
  await connectDb();
  const users = getUserCollection();
  const user = await users.findOne({ email: data.email });
  if (!user) return { success: false, error: "User not found" };
  const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  await users.updateOne({ email: data.email }, { $set: { resetToken } });
  return { success: true };
}

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6)
});
export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const parse = resetPasswordSchema.safeParse(data);
  if (!parse.success) return { success: false, error: "Missing data" };
  await connectDb();
  let payload: any;
  try {
    payload = jwt.verify(data.token, JWT_SECRET);
  } catch {
    return { success: false, error: "Invalid token" };
  }
  const users = getUserCollection();
  const user = await users.findOne({ _id: payload.userId });
  if (!user) return { success: false, error: "User not found" };
  const passwordHash = await bcrypt.hash(data.password, 10);
  await users.updateOne({ _id: payload.userId }, { $set: { passwordHash, resetToken: undefined, updatedAt: new Date() } });
  return { success: true };
}

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});
export async function refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const parse = refreshTokenSchema.safeParse(data);
  if (!parse.success) return { success: false, error: "Missing refresh token" };
  await connectDb();
  let payload: any;
  try {
    payload = jwt.verify(data.refreshToken, JWT_SECRET);
  } catch {
    return { success: false, error: "Invalid refresh token" };
  }
  const tokens = getTokenCollection();
  const tokenDoc = await tokens.findOne({ refreshToken: data.refreshToken });
  if (!tokenDoc) return { success: false, error: "Token not found" };
  const accessToken = jwt.sign({ userId: tokenDoc.userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
  await tokens.updateOne({ refreshToken: data.refreshToken }, { $set: { accessToken } });
  return { success: true, accessToken };
}
