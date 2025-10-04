import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  signup,
  setPassword,
  signin,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "./auth-service";
import {
  SignupRequest,
  SetPasswordRequest,
  SigninRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest
} from "@repo/types/lms/interfaces/requests";

export async function lmsAuthController(app: FastifyInstance) {
  app.post("/lms/signup",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body: SignupRequest = req.body as SignupRequest;
      const result = await signup(body);
      reply.send(result);
    }
  );

  app.post("/lms/set-password",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body: SetPasswordRequest = req.body as SetPasswordRequest;
      const result = await setPassword(body);
      reply.send(result);
    }
  );

  app.post("/lms/signin",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body: SigninRequest = req.body as SigninRequest;
      const result = await signin(body);
      reply.send(result);
    }
  );

  app.post("/lms/forgot-password",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body: ForgotPasswordRequest = req.body as ForgotPasswordRequest;
      const result = await forgotPassword(body);
      reply.send(result);
    }
  );

  app.post("/lms/reset-password",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body: ResetPasswordRequest = req.body as ResetPasswordRequest;
      const result = await resetPassword(body);
      reply.send(result);
    }
  );

  app.post("/lms/refresh-token",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body: RefreshTokenRequest = req.body as RefreshTokenRequest;
      const result = await refreshToken(body);
      reply.send(result);
    }
  );
}
