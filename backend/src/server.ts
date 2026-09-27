import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import "dotenv/config";
import Fastify from "fastify";
import { authRoutes } from "./modules/auth/authRoute.js";
import { projectRoutes } from "./modules/project/projectRoute.js";
import { taskRoutes } from "./modules/tasks/taskRoute.js";
import fastifyRateLimit from "@fastify/rate-limit";
import { projectMemberRoutes } from "./modules/projectMember/projectMemberRoute.js";

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
  cookie: {
    cookieName: "refresh_token",
    signed: false,
  },
});

app.register(fastifyCors, {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
});

app.register(fastifyRateLimit, {
  global: false,
  max: 5,
  timeWindow: 15 * 60 * 1000,
});

app.register(authRoutes, { prefix: "/auth" });
app.register(projectRoutes, { prefix: "/projects" });
app.register(taskRoutes, { prefix: "/projects" });
app.register(projectMemberRoutes, { prefix: "/projects" });

const start = async () => {
  try {
    await app.listen({ port: 3001 });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
