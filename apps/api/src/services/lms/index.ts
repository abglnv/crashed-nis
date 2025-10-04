import { FastifyInstance } from "fastify";
import { lmsAuthController } from "./routes/auth/auth-controller";
import { lmsClassesController } from "./routes/classes/classes-controller";

export async function lmsRouter(app: FastifyInstance) {
  await lmsAuthController(app);
  await lmsClassesController(app)
}
