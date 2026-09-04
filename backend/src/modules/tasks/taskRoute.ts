import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/client.js";
import { getProjectById } from "../project/projectService.js";
import { createTaskSchema } from "./taskSchema.js";
import { createTask, getTasksByProjectId } from "./taskService.js";

export function taskRoutes(app: FastifyInstance) {
  app.post<{ Params: { projectId: string } }>(
    "/:projectId/tasks",
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const userId = request.user.userId;
      const projectId = request.params.projectId;

      const result = createTaskSchema.safeParse(request.body);
      if (!result.success) {
        return reply.code(400).send({
          message: "Invalid request",
          errors: z.treeifyError(result.error),
        });
      }

      try {
        const existingProject = await getProjectById(projectId, userId);

        if (!existingProject) {
          return reply.code(404).send({
            message: "Project not found",
          });
        }

        const task = await createTask(projectId, result.data);

        return reply.code(201).send(task);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return reply.code(409).send({
            message: "Task with this title already exists in this project",
          });
        }

        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.get<{ Params: { projectId: string } }>(
    "/:projectId/tasks",
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const userId = request.user.userId;
      const projectId = request.params.projectId;

      try {
        const existingProject = await getProjectById(projectId, userId);

        if (!existingProject) {
          return reply.code(404).send({
            message: "Project not found",
          });
        }

        const tasks = await getTasksByProjectId(projectId);

        return reply.code(200).send(tasks);
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );
}
