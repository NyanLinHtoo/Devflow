import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import "dotenv/config";
import Fastify from "fastify";
import { z } from "zod";
import { pruneExpired } from "./lib/cleanup.js";
import { isAppError } from "./lib/errors.js";
import prisma from "./lib/prisma.js";
import { isValidationError } from "./lib/validation.js";
import { authRoutes } from "./modules/auth/authRoute.js";
import { projectRoutes } from "./modules/project/projectRoute.js";
import { projectMemberRoutes } from "./modules/projectMember/projectMemberRoute.js";
import { taskRoutes } from "./modules/tasks/taskRoute.js";

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
  trustProxy: process.env.TRUST_PROXY === "true",
});

// CSRF protection
const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

app.addHook("onRequest", async (request, reply) => {
  if (safeMethods.has(request.method)) {
    return;
  }

  const source = request.headers.origin ?? request.headers.referer;

  if (!source) {
    return reply.code(403).send({
      message: "Forbidden",
    });
  }

  let sourceOrigin: string;

  try {
    sourceOrigin = new URL(source).origin;
  } catch {
    return reply.code(403).send({
      message: "Forbidden",
    });
  }

  if (sourceOrigin !== frontendOrigin) {
    return reply.code(403).send({
      message: "Forbidden",
    });
  }
});

app.register(fastifyHelmet, {
  contentSecurityPolicy: false,
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

app.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch {
    await reply.code(401).send({ message: "Unauthorized" });
  }
});

app.setErrorHandler((error, request, reply) => {
  if (isValidationError(error)) {
    request.log.warn(error);
    return reply.code(400).send({
      message: "Invalid request",
      errors: z.treeifyError(error.zodError),
    });
  }

  if (isAppError(error)) {
    request.log.warn(error);
    return reply.code(error.statusCode).send({ message: error.message });
  }

  request.log.error(error);

  const statusCode =
    typeof (error as { statusCode?: unknown }).statusCode === "number"
      ? (error as { statusCode: number }).statusCode
      : 500;

  if (statusCode >= 500) {
    return reply.code(500).send({ message: "Internal server error" });
  }

  return reply
    .code(statusCode)
    .send({ message: error instanceof Error ? error.message : "Error" });
});

app.setNotFoundHandler((request, reply) => {
  return reply.code(404).send({ message: "Not found" });
});

app.register(authRoutes, { prefix: "/auth" });

app.register((protectedApp) => {
  protectedApp.addHook("onRequest", protectedApp.authenticate);

  protectedApp.register(projectRoutes, { prefix: "/projects" });
  protectedApp.register(taskRoutes, { prefix: "/projects" });
  protectedApp.register(projectMemberRoutes, { prefix: "/projects" });
});

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

const start = async () => {
  try {
    const port = Number(process.env.PORT ?? 3001);
    await app.listen({ port, host: "0.0.0.0" });

    const cleanupTimer = setInterval(() => {
      void pruneExpired().catch((error) => {
        app.log.error(error, "Failed to prune expired records");
      });
    }, CLEANUP_INTERVAL_MS);
    cleanupTimer.unref();

    const shutdown = async (signal: string) => {
      app.log.info(`Received ${signal}. Starting graceful shutdown...`);

      try {
        clearInterval(cleanupTimer);
        await app.close();
        await prisma.$disconnect();

        app.log.info("Graceful shutdown completed.");
        process.exit(0);
      } catch (error) {
        app.log.error(error, "Error during graceful shutdown");
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
