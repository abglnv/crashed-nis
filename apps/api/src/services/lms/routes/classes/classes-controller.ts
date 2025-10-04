import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { verifyBearerToken } from "../../middleware/auth-middleware";

export async function lmsClassesController(app: FastifyInstance) {
  app.get("/lms/classes", { preHandler: verifyBearerToken }, async (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ classes: [
      { id: 1, name: "Math" },
      { id: 2, name: "Physics" }
    ] });
  });

  app.post("/lms/classes", { preHandler: verifyBearerToken }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { name } = req.body as { name: string };
    reply.send({ success: true, class: { id: 3, name } });
  });
}
