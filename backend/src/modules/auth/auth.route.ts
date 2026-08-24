import type { FastifyInstance } from "fastify";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { loginUser, registerUser } from "./auth.service.js";
import z from "zod";

export function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const result = registerSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid request",
        errors: z.treeifyError(result.error),
      });
    }

    try {
      const user = await registerUser(result.data);
      return reply.code(201).send(user);
    } catch (error) {
      if (error instanceof Error && error.message === "User already exists") {
        return reply.code(409).send({
          message: "User already exists",
        });
      }

      return reply.code(500).send({
        message: "Internal server error",
      });
    }
  });

  app.post("/login", async (request, reply) => {
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid request",
        errors: z.treeifyError(result.error),
      });
    }

    try {
      const user = await loginUser(result.data);
      return reply.code(200).send(user);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invalid email or password"
      ) {
        return reply.code(401).send({
          message: "Invalid email or password",
        });
      }
      return reply.code(500).send({
        message: "Internal server error",
      });
    }
  });
}
