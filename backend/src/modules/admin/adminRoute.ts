import type { FastifyInstance } from "fastify";
import { appError } from "../../lib/errors.js";
import { validate } from "../../lib/validation.js";
import { getUserById } from "../auth/authService.js";
import {
  adminUserParamsSchema,
  listUsersQuerySchema,
  updateUserRoleSchema,
} from "./adminSchema.js";
import { listUsers, updateUserRole } from "./adminService.js";

export function adminRoutes(app: FastifyInstance) {
  app.addHook("onRequest", async (request, reply) => {
    const user = await getUserById(request.user.userId);

    if (!user || user.role !== "ADMIN") {
      await reply.code(403).send({
        message: "You don't have permission to access admin resources",
      });
    }
  });

  app.get("/users", async (request, reply) => {
    const query = validate(listUsersQuerySchema, request.query);

    const result = await listUsers(query);

    return reply.code(200).send(result);
  });

  app.patch<{ Params: { userId: string } }>(
    "/users/:userId/role",
    async (request, reply) => {
      const actorId = request.user.userId;
      const { userId } = validate(adminUserParamsSchema, request.params);
      const input = validate(updateUserRoleSchema, request.body);

      const result = await updateUserRole(actorId, userId, input);

      if (result.status === "NOT_FOUND") {
        throw appError("userNotFound");
      }

      if (result.status === "LAST_ADMIN") {
        throw appError("lastAdmin");
      }

      return reply.code(200).send(result.user);
    },
  );
}
