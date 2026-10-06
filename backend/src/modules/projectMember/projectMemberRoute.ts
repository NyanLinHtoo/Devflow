import type { FastifyInstance } from "fastify";
import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";
import { validate } from "../../lib/validation.js";
import { projectParamsSchema } from "../project/projectSchema.js";
import {
  addProjectMemberSchema,
  projectMemberParamsSchema,
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
      const userId = request.user.userId;
      const { projectId } = validate(projectParamsSchema, request.params);
      const input = validate(addProjectMemberSchema, request.body);

      const isManager = await isProjectManager(projectId, userId);

      if (!isManager) {
        return reply
          .code(403)
          .send({ message: "You don't have permission add members" });
      }

      const targetUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!targetUser) {
        return reply.code(404).send({
          message: "User not found",
        });
      }

      try {
        const projectMember = await addProjectMember(
          projectId,
          targetUser.id,
          input.role,
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

        throw error;
      }
    },
  );

  app.get<{ Params: { projectId: string } }>(
    "/:projectId/members",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId } = validate(projectParamsSchema, request.params);

      const projectMember = await getProjectMember(projectId, userId);

      if (!projectMember) {
        return reply
          .code(403)
          .send({ message: "You are not a member of this project" });
      }

      const projectMembers = await getProjectMembers(projectId);

      return reply.code(200).send(projectMembers);
    },
  );

  app.patch<{ Params: { projectId: string; memberId: string } }>(
    "/:projectId/members/:memberId",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId, memberId } = validate(
        projectMemberParamsSchema,
        request.params,
      );
      const input = validate(updateProjectMemberRoleSchema, request.body);

      const isManager = await isProjectManager(projectId, userId);

      if (!isManager) {
        return reply
          .code(403)
          .send({ message: "You don't have permission to update" });
      }

      const updatedProjectMemberRole = await updateProjectMemberRole(
        projectId,
        memberId,
        input.role,
      );

      if (updatedProjectMemberRole.status === "NOT_FOUND") {
        return reply.code(404).send({ message: "Project member not found" });
      }

      if (updatedProjectMemberRole.status === "LAST_MANAGER") {
        return reply.code(403).send({
          message: "A project must keep at least one manager",
        });
      }

      return reply.code(200).send(updatedProjectMemberRole.member);
    },
  );

  app.delete<{ Params: { projectId: string; memberId: string } }>(
    "/:projectId/members/:memberId",
    async (request, reply) => {
      const userId = request.user.userId;
      const { projectId, memberId } = validate(
        projectMemberParamsSchema,
        request.params,
      );

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

      if (deletedProjectMember.status === "LAST_MANAGER") {
        return reply.code(403).send({
          message: "A project must keep at least one manager",
        });
      }

      return reply
        .code(200)
        .send({ message: "Project member removed successfully" });
    },
  );
}
