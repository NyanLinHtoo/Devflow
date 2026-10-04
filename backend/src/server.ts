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
const frontendOriginValue = process.env.FRONTEND_ORIGIN;

if (!accessJwtSecret || !refreshJwtSecret) {
  throw new Error("JWT secrets are not defined");
}

if (!frontendOriginValue) {
  throw new Error("FRONTEND_ORIGIN is not defined");
}

const frontendOrigin = new URL(frontendOriginValue).origin;

const app = Fastify({
  logger: true,
});

// CSRF protection
const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

app.addHook("onRequest", async (request, reply) => {
  // Safe methods should never change application state.
  if (safeMethods.has(request.method)) {
    return;
  }

  // Prefer Origin. Use Referer only when Origin is missing.
  const source = request.headers.origin ?? request.headers.referer;

  // Reject requests when neither header is available.
  if (!source) {
    return reply.code(403).send({
      message: "Forbidden",
    });
  }

  let sourceOrigin: string;

  try {
    // Extract only the origin (protocol + hostname + port).
    sourceOrigin = new URL(source).origin;
  } catch {
    // Reject malformed Origin or Referer values.
    return reply.code(403).send({
      message: "Forbidden",
    });
  }

  // The request must come from our trusted frontend.
  if (sourceOrigin !== frontendOrigin) {
    return reply.code(403).send({
      message: "Forbidden",
    });
  }
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
  origin: frontendOrigin,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
