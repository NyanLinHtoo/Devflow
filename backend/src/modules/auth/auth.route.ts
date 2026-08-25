import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { loginSchema, registerSchema } from "./auth.schema.js";
import {
  createSession,
  deleteSessionById,
  getSessionById,
  getUserById,
  loginUser,
  registerUser,
  updateSessionRefreshToken,
} from "./auth.service.js";
import * as argon2 from "argon2";
import { RefreshTokenPayload } from "./auth.types.js";

export function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const result = registerSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid request",
        errors: z.treeifyError(result.error),
      });
    }

    try {
      const user = await registerUser(result.data);
      return reply.code(201).send(user);
    } catch (error) {
      if (error instanceof Error && error.message === "User already exists") {
        return reply.code(409).send({
          message: "User already exists",
        });
      }

      return reply.code(500).send({
        message: "Internal server error",
      });
    }
  });

  app.post("/login", async (request, reply) => {
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid request",
        errors: z.treeifyError(result.error),
      });
    }

    try {
      const user = await loginUser(result.data);

      const session = await createSession(user.id);

      const refreshToken = await reply.jwtSign(
        {
          userId: user.id,
          sessionId: session.id,
        },
        {
          sign: {
            expiresIn: "7d",
          },
        },
      );
      const refreshTokenHash = await argon2.hash(refreshToken);

      await updateSessionRefreshToken(session.id, refreshTokenHash);

      const accessToken = await reply.jwtSign(
        {
          userId: user.id,
          email: user.email,
        },
        {
          sign: {
            expiresIn: "15m",
          },
        },
      );

      reply.setCookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 60 * 15,
      });

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.code(200).send(user);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invalid email or password"
      ) {
        return reply.code(401).send({
          message: "Invalid email or password",
        });
      }
      return reply.code(500).send({
        message: "Internal server error",
      });
    }
  });

  app.get("/me", async (request, reply) => {
    try {
      await request.jwtVerify();

      return reply.code(200).send(request.user);
    } catch {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }
  });

  app.post("/logout", async (request, reply) => {
    const refreshToken = request.cookies.refresh_token;

    if (refreshToken) {
      try {
        const payload = app.jwt.verify<RefreshTokenPayload>(refreshToken);

        await deleteSessionById(payload.sessionId);
      } catch {
        request.log.warn(error, "Failed to verify refresh token during logout");
      }
    }

    reply.clearCookie("access_token", {
      path: "/",
    });

    reply.clearCookie("refresh_token", {
      path: "/",
    });

    return reply.code(200).send({
      message: "Logged out successfully",
    });
  });

  app.post("/refresh", async (request, reply) => {
    const refreshToken = request.cookies.refresh_token;

    if (!refreshToken) {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }

    try {
      const payload = app.jwt.verify<RefreshTokenPayload>(refreshToken);

      const session = await getSessionById(payload.sessionId);
      if (!session) {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      if (!session.refreshTokenHash) {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      if (session.userId !== payload.userId) {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      if (session.expiresAt.getTime() < Date.now()) {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const isRefreshTokenValid = await argon2.verify(
        session.refreshTokenHash,
        refreshToken,
      );

      if (!isRefreshTokenValid) {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const user = await getUserById(payload.userId);
      if (!user) {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      const accessToken = await reply.jwtSign(
        {
          userId: user.id,
          email: user.email,
        },
        {
          sign: {
            expiresIn: "15m",
          },
        },
      );

      reply.setCookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 60 * 15,
      });

      return reply.code(200).send({
        message: "Access token refreshed",
      });
    } catch {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }
  });
}
