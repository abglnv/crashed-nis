import { config as dotenv } from "dotenv";
import { z } from "zod";
import path from "node:path";

dotenv({ path: path.resolve(process.cwd(), ".env") });      
dotenv({ path: path.resolve(process.cwd(), ".env.local") }); 

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1),
  MONGO_URI: z.string().url()
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;