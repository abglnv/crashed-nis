import Fastify from "fastify";

const app = Fastify({ logger: true });

// health check route
app.get("/health", async () => {
  return { status: "ok", time: new Date().toISOString() };
});

const start = async () => {
  try {
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("🚀 Fastify API ready at http://localhost:3001");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();