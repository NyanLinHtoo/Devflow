import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/client.js";
import { getProjectById } from "../project/projectService.js";
import {
  createTaskSchema,
  taskParamsSchema,
  updateTaskSchema,
} from "./taskSchema.js";
import {
  createTask,
  deleteTask,
  getTaskByIdAndProjectId,
  getTasksByProjectId,
  updateTask,
  updateTaskAssignee,
} from "./taskService.js";
import { updateTaskAssigneeSchema } from "./taskAssigneeSchema.js";
import { isProjectManager } from "../projectMember/projectMemberService.js";

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

  app.get<{ Params: { projectId: string; taskId: string } }>(
    "/:projectId/tasks/:taskId",
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
      const taskId = request.params.taskId;

      try {
        const existingProject = await getProjectById(projectId, userId);

        if (!existingProject) {
          return reply.code(404).send({
            message: "Project not found",
          });
        }

        const task = await getTaskByIdAndProjectId(projectId, taskId);

        if (!task) {
          return reply.code(404).send({ message: "Task not found" });
        }

        return reply.code(200).send(task);
      } catch {
        return reply.code(500).send({ message: "Internal server error" });
      }
    },
  );

  app.patch<{ Params: { projectId: string; taskId: string } }>(
    "/:projectId/tasks/:taskId",
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
      const taskId = request.params.taskId;

      const result = updateTaskSchema.safeParse(request.body);
      if (!result.success) {
        return reply.code(400).send({
          message: "Invalid request",
          errors: z.treeifyError(result.error),
        });
      }

      try {
        const project = await getProjectById(projectId, userId);

        if (!project) {
          return reply.code(404).send({
            message: "Project not found",
          });
        }

        const updatedTask = await updateTask(projectId, taskId, result.data);

        if (!updatedTask) {
          return reply.code(404).send({ message: "Task not found" });
        }

        return reply.code(200).send(updatedTask);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return reply.code(409).send({
            message: "Task with this title already exists in this project",
          });
        }

        return reply.code(500).send({ message: "Internal server error" });
      }
    },
  );

  app.delete<{ Params: { projectId: string; taskId: string } }>(
    "/:projectId/tasks/:taskId",
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
      const taskId = request.params.taskId;

      try {
        const project = await getProjectById(projectId, userId);

        if (!project) {
          return reply.code(404).send({
            message: "Project not found",
          });
        }

        const isManager = await isProjectManager(projectId, userId);
        if (!isManager) {
          return reply.code(403).send({
            message: "You don't have permission to delete",
          });
        }

        const deletedTask = await deleteTask(projectId, taskId);

        if (!deletedTask) {
          return reply.code(404).send({ message: "Task not found" });
        }

        return reply.code(200).send({ message: "Task deleted successfully" });
      } catch {
        return reply.code(500).send({ message: "Internal server error" });
      }
    },
  );

  app.patch<{ Params: { projectId: string; taskId: string } }>(
    "/:projectId/tasks/:taskId/assignee",
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const paramsResult = taskParamsSchema.safeParse(request.params);

      if (!paramsResult.success) {
        return reply.code(400).send({
          message: "Invalid project ID or task ID",
          errors: z.treeifyError(paramsResult.error),
        });
      }

      const userId = request.user.userId;
      const projectId = paramsResult.data.projectId;
      const taskId = paramsResult.data.taskId;

      const result = updateTaskAssigneeSchema.safeParse(request.body);
      if (!result.success) {
        return reply.code(400).send({
          message: "Invalid request",
          errors: z.treeifyError(result.error),
        });
      }

      try {
        const isManager = await isProjectManager(projectId, userId);
        if (!isManager) {
          return reply
            .code(403)
            .send({ message: "You don't have permission to assign tasks" });
        }

        const assigneeResult = await updateTaskAssignee(
          projectId,
          taskId,
          result.data.assignedMemberId,
        );

        if (assigneeResult.status === "TASK_NOT_FOUND") {
          return reply.code(404).send({ message: "Task not found" });
        }

        if (assigneeResult.status === "MEMBER_NOT_FOUND") {
          return reply.code(404).send({ message: "Project member not found" });
        }

        return reply.code(200).send(assigneeResult.task);
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );
}
