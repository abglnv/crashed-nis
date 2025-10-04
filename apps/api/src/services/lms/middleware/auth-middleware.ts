import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import {env} from "../../../config"

const JWT_SECRET = env.JWT_SECRET

export async function verifyBearerToken(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Missing or invalid Authorization header" });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
  } catch {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }
}
