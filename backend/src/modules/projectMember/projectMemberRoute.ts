import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";
import {
  addProjectMemberSchema,
  projectMemberParamsSchema,
  projectParamsSchema,
  updateProjectMemberRoleSchema,
} from "./projectMemberSchema.js";
import {
  addProjectMember,
  deleteProjectMember,
  getProjectMember,
  getProjectMembers,
  isProjectManager,
  updateProjectMemberRole,
} from "./projectMemberService.js";

export function projectMemberRoutes(app: FastifyInstance) {
  app.post<{ Params: { projectId: string } }>(
    "/:projectId/members",
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

      const userId = request.user.userId;
      const projectId = paramsResult.data.projectId;

      const result = addProjectMemberSchema.safeParse(request.body);

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
            .send({ message: "You don't have permission add members" });
        }

        const targetUser = await prisma.user.findUnique({
          where: {
            email: result.data.email,
          },
        });

        if (!targetUser) {
          return reply.code(404).send({
            message: "User not found",
          });
        }

        const projectMember = await addProjectMember(
          projectId,
          targetUser.id,
          result.data.role,
        );

        return reply.code(201).send(projectMember);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return reply.code(409).send({
            message: "User is already a member of this project",
          });
        }

        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.get<{ Params: { projectId: string } }>(
    "/:projectId/members",
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

      const userId = request.user.userId;
      const projectId = paramsResult.data.projectId;

      try {
        const projectMember = await getProjectMember(projectId, userId);
        if (!projectMember) {
          return reply
            .code(403)
            .send({ message: "You are not a member of this project" });
        }

        const projectMembers = await getProjectMembers(projectId);

        return reply.code(200).send(projectMembers);
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.patch<{ Params: { projectId: string; memberId: string } }>(
    "/:projectId/members/:memberId",
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }
      const paramsResult = projectMemberParamsSchema.safeParse(request.params);

      if (!paramsResult.success) {
        return reply.code(400).send({
          message: "Invalid project ID or member ID",
          errors: z.treeifyError(paramsResult.error),
        });
      }

      const userId = request.user.userId;
      const projectId = paramsResult.data.projectId;
      const memberId = paramsResult.data.memberId;

      const result = updateProjectMemberRoleSchema.safeParse(request.body);

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
            .send({ message: "You don't have permission to update" });
        }

        const updatedProjectMemberRole = await updateProjectMemberRole(
          projectId,
          memberId,
          result.data.role,
        );

        if (updatedProjectMemberRole.status === "NOT_FOUND") {
          return reply.code(404).send({ message: "Project member not found" });
        }

        if (updatedProjectMemberRole.status === "FORBIDDEN") {
          return reply
            .code(403)
            .send({ message: "You don't have permission to update" });
        }

        return reply.code(200).send(updatedProjectMemberRole.member);
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.delete<{ Params: { projectId: string; memberId: string } }>(
    "/:projectId/members/:memberId",
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const paramsResult = projectMemberParamsSchema.safeParse(request.params);

      if (!paramsResult.success) {
        return reply.code(400).send({
          message: "Invalid project ID or member ID",
          errors: z.treeifyError(paramsResult.error),
        });
      }

      const userId = request.user.userId;
      const projectId = paramsResult.data.projectId;
      const memberId = paramsResult.data.memberId;

      try {
        const isManager = await isProjectManager(projectId, userId);
        if (!isManager) {
          return reply
            .code(403)
            .send({ message: "You don't have permission to remove members" });
        }

        const deletedProjectMember = await deleteProjectMember(
          projectId,
          memberId,
        );

        if (deletedProjectMember.status === "NOT_FOUND") {
          return reply.code(404).send({ message: "Project member not found" });
        }

        if (deletedProjectMember.status === "FORBIDDEN") {
          return reply.code(403).send({
            message: "You don't have permission to remove member",
          });
        }

        return reply
          .code(200)
          .send({ message: "Project member removed successfully" });
      } catch {
        return reply.code(500).send({ message: "Internal server error" });
      }
    },
  );
}
