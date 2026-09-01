import type { FastifyInstance } from "fastify";
import { createProjectSchema } from "./projectSchema.js";
import {
  createProject,
  getProjectById,
  getProjectsByOwnerId,
} from "./projectService.js";
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
    const userId = request.user.userId;

    const result = createProjectSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid request",
        errors: z.treeifyError(result.error),
      });
    }

    try {
      const project = await createProject(userId, result.data);

      return reply.code(201).send(project);
    } catch {
      return reply.code(500).send({
        message: "Internal server error",
      });
    }
  });

  app.get("/", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }

    const userId = request.user.userId;

    try {
      const projects = await getProjectsByOwnerId(userId);

      return reply.code(200).send(projects);
    } catch {
      return reply.code(500).send({
        message: "Internal server error",
      });
    }
  });

  app.get<{ Params: { projectId: string } }>(
    "/:projectId",
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const projectId = request.params.projectId;
      const userId = request.user.userId;

      try {
        const project = await getProjectById(projectId, userId);

        if (!project) {
          return reply.code(404).send({
            message: "Project not found",
          });
        }

        return reply.code(200).send(project);
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );
}
