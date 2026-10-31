import type { FastifyInstance } from "fastify";
import { validate } from "../../lib/validation.js";
import { getUserById } from "../auth/authService.js";
import { isProjectManager } from "../project-members/projectMemberService.js";
import {
  createProjectSchema,
  projectParamsSchema,
  updateProjectSchema,
} from "./projectSchema.js";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectsByMemberId,
  updateProject,
} from "./projectService.js";

export function projectRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const userId = request.user.userId;
    const input = validate(createProjectSchema, request.body);

    const user = await getUserById(userId);

    if (!user || user.role !== "MANAGER") {
      return reply.code(403).send({
        message: "You don't have permission to create projects",
      });
    }

    const project = await createProject(userId, input);

    return reply.code(201).send(project);
  });

  app.get("/", async (request, reply) => {
    const userId = request.user.userId;

    const projects = await getProjectsByMemberId(userId);

    return reply.code(200).send(projects);
  });

  app.get<{ Params: { projectId: string } }>(
    "/:projectId",
    async (request, reply) => {
      const { projectId } = validate(projectParamsSchema, request.params);
      const userId = request.user.userId;

      const project = await getProjectById(projectId, userId);

      if (!project) {
        return reply.code(404).send({
          message: "Project not found",
        });
      }

      return reply.code(200).send(project);
    },
  );

  app.patch<{ Params: { projectId: string } }>(
    "/:projectId",
    async (request, reply) => {
      const { projectId } = validate(projectParamsSchema, request.params);
      const userId = request.user.userId;
      const input = validate(updateProjectSchema, request.body);

      const project = await getProjectById(projectId, userId);

      if (!project) {
        return reply.code(404).send({
          message: "Project not found",
        });
      }

      const isManager = await isProjectManager(projectId, userId);

      if (!isManager) {
        return reply.code(403).send({
          message: "You don't have permission to update project",
        });
      }

      const updatedProject = await updateProject(projectId, input, userId);

      return reply.code(200).send(updatedProject);
    },
  );

  app.delete<{ Params: { projectId: string } }>(
    "/:projectId",
    async (request, reply) => {
      const { projectId } = validate(projectParamsSchema, request.params);
      const userId = request.user.userId;

      const project = await getProjectById(projectId, userId);

      if (!project) {
        return reply.code(404).send({
          message: "Project not found",
        });
      }

      const isManager = await isProjectManager(projectId, userId);

      if (!isManager) {
        return reply.code(403).send({
          message: "You don't have permission to delete project",
        });
      }

      await deleteProject(projectId);

      return reply.code(200).send({
        message: "Project deleted successfully",
      });
    },
  );
}
