import type { FastifyInstance } from "fastify";
import { z } from "zod";
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
import { isProjectManager } from "../projectMember/projectMemberService.js";

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
      const projects = await getProjectsByMemberId(userId);

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

      const paramsResult = projectParamsSchema.safeParse(request.params);

      if (!paramsResult.success) {
        return reply.code(400).send({
          message: "Invalid project ID",
          errors: z.treeifyError(paramsResult.error),
        });
      }

      const projectId = paramsResult.data.projectId;
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

  app.patch<{ Params: { projectId: string } }>(
    "/:projectId",
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const paramsResult = projectParamsSchema.safeParse(request.params);

      if (!paramsResult.success) {
        return reply.code(400).send({
          message: "Invalid project ID",
          errors: z.treeifyError(paramsResult.error),
        });
      }

      const projectId = paramsResult.data.projectId;
      const userId = request.user.userId;

      const result = updateProjectSchema.safeParse(request.body);
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

        const isManager = await isProjectManager(projectId, userId);

        if (!isManager) {
          return reply.code(403).send({
            message: "You don't have permission to update project",
          });
        }

        const updatedProject = await updateProject(projectId, result.data);

        return reply.code(200).send(updatedProject);
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.delete<{ Params: { projectId: string } }>(
    "/:projectId",
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }
      const paramsResult = projectParamsSchema.safeParse(request.params);

      if (!paramsResult.success) {
        return reply.code(400).send({
          message: "Invalid project ID",
          errors: z.treeifyError(paramsResult.error),
        });
      }

      const projectId = paramsResult.data.projectId;
      const userId = request.user.userId;

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
            message: "You don't have permission to delete project",
          });
        }

        await deleteProject(projectId);

        return reply.code(200).send({
          message: "Project deleted successfully",
        });
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );
}
