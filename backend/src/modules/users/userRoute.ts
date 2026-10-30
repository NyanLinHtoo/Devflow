import type { FastifyInstance } from "fastify";
import { validate } from "../../lib/validation.js";
import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from "./userSchema.js";
import { changePassword, deleteAccount, updateProfile } from "./userService.js";

const cookieDomain = process.env.COOKIE_DOMAIN;

const clearCookieOptions = {
  path: "/",
  ...(cookieDomain ? { domain: cookieDomain } : {}),
};

export function userRoutes(app: FastifyInstance) {
  app.patch("/me", async (request, reply) => {
    const input = validate(updateProfileSchema, request.body);

    const user = await updateProfile(request.user.userId, input);

    return reply.code(200).send(user);
  });

  app.post("/me/password", async (request, reply) => {
    const input = validate(changePasswordSchema, request.body);

    const result = await changePassword(request.user.userId, input);

    if (result.status === "NOT_FOUND") {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    if (result.status === "INVALID_PASSWORD") {
      return reply.code(400).send({ message: "Current password is incorrect" });
    }

    return reply.code(200).send({ message: "Password updated successfully" });
  });

  app.delete("/me", async (request, reply) => {
    const input = validate(deleteAccountSchema, request.body);

    const result = await deleteAccount(request.user.userId, input);

    if (result.status === "NOT_FOUND") {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    if (result.status === "INVALID_PASSWORD") {
      return reply.code(400).send({ message: "Password is incorrect" });
    }

    if (result.status === "LAST_MANAGER") {
      return reply.code(409).send({
        message:
          "Transfer or delete projects where you are the last manager first.",
      });
    }

    reply.clearCookie("access_token", clearCookieOptions);
    reply.clearCookie("refresh_token", clearCookieOptions);

    return reply.code(200).send({ message: "Account deleted successfully" });
  });
}
