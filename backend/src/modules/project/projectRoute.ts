import type { FastifyInstance } from "fastify";
import { createProjectSchema } from "./projectSchema.js";
import { createProject } from "./projectService.js";
import { z } from "zod";

export function projectRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }

    const result = createProjectSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid request",
        errors: z.treeifyError(result.error),
      });
    }

    try {
      const project = await createProject(request.user.userId, result.data);

      return reply.code(201).send(project);
    } catch {
      return reply.code(500).send({
        message: "Internal server error",
      });
    }
  });
}
