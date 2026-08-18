import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/health", () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    await app.listen({ port: 3001 });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
