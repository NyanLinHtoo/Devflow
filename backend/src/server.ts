import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import Fastify from "fastify";
import { authRoutes } from "./modules/auth/auth.route.js";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

const app = Fastify({
  logger: true,
});

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: jwtSecret,
  cookie: {
    cookieName: "access_token",
    signed: false,
  },
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
