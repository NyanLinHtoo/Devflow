import Fastify from "fastify";
import prisma from "./lib/prisma.js";
import { authRoutes } from "./modules/auth/auth.route.js";

const app = Fastify({
  logger: true,
});

app.get("/health", () => {
  return { status: "ok" };
});

app.get("/users/count", async () => {
  const userCount = await prisma.user.count();
  return { userCount };
});

app.register(authRoutes, { prefix: "/auth" });

const start = async () => {
  try {
    await app.listen({ port: 3001 });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
