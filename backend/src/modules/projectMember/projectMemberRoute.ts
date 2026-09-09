import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";
import { getProjectById } from "../project/projectService.js";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { addProjectMemberSchema } from "./projectMemberSchema.js";
import { addProjectMember } from "./projectMemberService.js";

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

      const userId = request.user.userId;
      const projectId = request.params.projectId;

      const result = addProjectMemberSchema.safeParse(request.body);

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

        if (targetUser.id === project.ownerId) {
          return reply.code(400).send({
            message: "Project owner cannot be added as a member",
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
}
