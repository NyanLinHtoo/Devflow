import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import Fastify from "fastify";
import { authRoutes } from "./modules/auth/auth.route.js";

const accessJwtSecret = process.env.JWT_ACCESS_SECRET;
const refreshJwtSecret = process.env.JWT_REFRESH_SECRET;

if (!accessJwtSecret || !refreshJwtSecret) {
  throw new Error("JWT secrets are not defined");
}

const app = Fastify({
  logger: true,
});

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: accessJwtSecret,
  cookie: {
    cookieName: "access_token",
    signed: false,
  },
});

app.register(fastifyJwt, {
  secret: refreshJwtSecret,
  namespace: "refresh",
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
