import type { FastifyInstance } from "fastify";
import { Prisma } from "../../generated/prisma/client.js";
import { validate } from "../../lib/validation.js";
import { getProjectById } from "../projects/projectService.js";
import { isProjectManager } from "../project-members/projectMemberService.js";
import { updateTaskAssigneeSchema } from "./taskAssigneeSchema.js";
import {
  createTaskSchema,
  taskParamsSchema,
  taskProjectParamsSchema,
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

export function taskRoutes(app: FastifyInstance) {
  app.post<{ Params: { projectId: string } }>(
    "/:projectId/tasks",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId } = validate(taskProjectParamsSchema, request.params);
      const input = validate(createTaskSchema, request.body);

      const existingProject = await getProjectById(projectId, userId);

      if (!existingProject) {
        return reply.code(404).send({
          message: "Project not found",
        });
      }

      try {
        const task = await createTask(projectId, input);

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

        throw error;
      }
    },
  );

  app.get<{ Params: { projectId: string } }>(
    "/:projectId/tasks",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId } = validate(taskProjectParamsSchema, request.params);

      const existingProject = await getProjectById(projectId, userId);

      if (!existingProject) {
        return reply.code(404).send({
          message: "Project not found",
        });
      }

      const tasks = await getTasksByProjectId(projectId);

      return reply.code(200).send(tasks);
    },
  );

  app.get<{ Params: { projectId: string; taskId: string } }>(
    "/:projectId/tasks/:taskId",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId, taskId } = validate(taskParamsSchema, request.params);

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
    },
  );

  app.patch<{ Params: { projectId: string; taskId: string } }>(
    "/:projectId/tasks/:taskId",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId, taskId } = validate(taskParamsSchema, request.params);
      const input = validate(updateTaskSchema, request.body);

      const project = await getProjectById(projectId, userId);

      if (!project) {
        return reply.code(404).send({
          message: "Project not found",
        });
      }

      try {
        const updatedTask = await updateTask(projectId, taskId, input);

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

        throw error;
      }
    },
  );

  app.delete<{ Params: { projectId: string; taskId: string } }>(
    "/:projectId/tasks/:taskId",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId, taskId } = validate(taskParamsSchema, request.params);

      const project = await getProjectById(projectId, userId);

      if (!project) {
        return reply.code(404).send({
          message: "Project not found",
        });
      }

      const deletedTask = await deleteTask(projectId, taskId);

      if (!deletedTask) {
        return reply.code(404).send({ message: "Task not found" });
      }

      return reply.code(200).send({ message: "Task deleted successfully" });
    },
  );

  app.patch<{ Params: { projectId: string; taskId: string } }>(
    "/:projectId/tasks/:taskId/assignee",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId, taskId } = validate(taskParamsSchema, request.params);
      const input = validate(updateTaskAssigneeSchema, request.body);

      const isManager = await isProjectManager(projectId, userId);

      if (!isManager) {
        return reply
          .code(403)
          .send({ message: "You don't have permission to assign tasks" });
      }

      const assigneeResult = await updateTaskAssignee(
        projectId,
        taskId,
        input.assignedMemberId,
      );

      if (assigneeResult.status === "TASK_NOT_FOUND") {
        return reply.code(404).send({ message: "Task not found" });
      }

      if (assigneeResult.status === "MEMBER_NOT_FOUND") {
        return reply.code(404).send({ message: "Project member not found" });
      }

      return reply.code(200).send(assigneeResult.task);
    },
  );
}
