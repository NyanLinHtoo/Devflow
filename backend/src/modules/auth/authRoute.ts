import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  confirmPasswordResetSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./authSchema.js";
import {
  createSession,
  deleteSessionById,
  getSessionById,
  getUserByEmail,
  getUserById,
  loginUser,
  registerUser,
  requestEmailVerification,
  requestPasswordReset,
  resetPassword,
  updateSessionRefreshToken,
  verifyEmail,
} from "./authService.js";
import * as argon2 from "argon2";
import { RefreshTokenPayload } from "./authTypes.js";

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

      const verification = await requestEmailVerification(user.id);

      if (verification.status !== "CREATED") {
        return reply.code(500).send({
          message: "Failed to create email verification",
        });
      }

      return reply.code(201).send({
        user,
        emailVerification: {
          token: verification.rawToken,
          expiresAt: verification.expiresAt,
        },
      });
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

  app.post(
    "/login",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 15 * 60 * 1000,
        },
      },
    },
    async (request, reply) => {
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

        const refreshToken = await reply.refreshJwtSign(
          {
            userId: user.id,
            sessionId: session.id,
          },
          {
            sign: {
              expiresIn: "30d",
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
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 15,
        });

        reply.setCookie("refresh_token", refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
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
        } else if (
          error instanceof Error &&
          error.message === "EMAIL_NOT_VERIFIED"
        ) {
          return reply.code(403).send({
            message: "Please verify your email before logging in.",
          });
        }
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.get("/me", async (request, reply) => {
    try {
      await request.jwtVerify();

      const payload = request.user as {
        userId: string;
      };

      const user = await getUserById(payload.userId);

      if (!user) {
        return reply.code(401).send({
          message: "Unauthorized",
        });
      }

      return reply.code(200).send(user);
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
        const payload = await request.refreshJwtVerify<RefreshTokenPayload>();

        await deleteSessionById(payload.sessionId);
      } catch (error) {
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
      const payload = await request.refreshJwtVerify<RefreshTokenPayload>();

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
        secure: process.env.NODE_ENV === "production",
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

  app.post(
    "/forgot-password",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 15 * 60 * 1000,
        },
      },
    },
    async (request, reply) => {
      const result = resetPasswordSchema.safeParse(request.body);
      if (!result.success) {
        return reply.code(400).send({
          message: "Invalid request",
          errors: z.treeifyError(result.error),
        });
      }

      try {
        const resetResult = await requestPasswordReset(result.data.email);

        if (resetResult.status === "COOLDOWN") {
          return reply.send({
            message: "If the account exists, a reset email will be sent.",
          });
        }

        if (resetResult.status === "CREATED") {
          // TEMPORARY:
          // We return the raw token only for development/testing.
          return reply.send({
            message: "If the account exists, a reset email will be sent.",
            resetToken: resetResult.rawToken,
            expiresAt: resetResult.expiresAt,
          });
        }

        return reply.send({
          message: "If the account exists, a reset email will be sent.",
        });
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.post(
    "/reset-password",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 15 * 60 * 1000,
        },
      },
    },
    async (request, reply) => {
      const result = confirmPasswordResetSchema.safeParse(request.body);
      if (!result.success) {
        return reply.code(400).send({
          message: "Invalid request",
          errors: z.treeifyError(result.error),
        });
      }

      try {
        const confirmPasswordReset = await resetPassword(
          result.data.token,
          result.data.password,
        );

        if (
          confirmPasswordReset.status === "INVALID" ||
          confirmPasswordReset.status === "USED" ||
          confirmPasswordReset.status === "EXPIRED"
        ) {
          return reply.status(400).send({
            message: "A reset link is not valid",
          });
        }

        return reply.status(200).send({
          message: "Password successfully updated",
        });
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.get(
    "/verify-email",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: 15 * 60 * 1000,
        },
      },
    },
    async (request, reply) => {
      const result = verifyEmailSchema.safeParse(request.body);

      if (!result.success) {
        return reply.code(400).send({
          message: "Invalid request",
          errors: z.treeifyError(result.error),
        });
      }

      try {
        const verifyEmailResult = await verifyEmail(result.data.token);

        if (verifyEmailResult.status === "NOT_FOUND") {
          return reply.code(400).send({
            message: "Invalid verification link",
          });
        }

        if (verifyEmailResult.status === "USED") {
          return reply.code(400).send({
            message: "Verification link has already been used",
          });
        }

        if (verifyEmailResult.status === "INVALID") {
          return reply.code(400).send({
            message: "Invalid or expired verification link",
          });
        }

        return reply.code(200).send({
          message: "Email verified successfully",
        });
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );

  app.post(
    "/resend-verification",
    { config: { rateLimit: { max: 5, timeWindow: 15 * 60 * 1000 } } },
    async (request, reply) => {
      const result = resendVerificationSchema.safeParse(request.body);

      if (!result.success) {
        return reply.code(400).send({
          message: "Invalid request",
          errors: z.treeifyError(result.error),
        });
      }

      try {
        const existingUser = await getUserByEmail(result.data.email);
        if (!existingUser) {
          return reply.send({
            message:
              "If the account exists and needs verification, a verification email will be sent.",
          });
        }

        const resendVerification = await requestEmailVerification(
          existingUser.id,
        );

        if (resendVerification.status !== "CREATED") {
          return reply.send({
            message:
              "If the account exists and needs verification, a verification email will be sent.",
          });
        }

        return reply.code(200).send({
          message:
            "If the account exists and needs verification, a verification email will be sent.",
          emailVerification: {
            token: resendVerification.rawToken,
            expiresAt: resendVerification.expiresAt,
          },
        });
      } catch {
        return reply.code(500).send({
          message: "Internal server error",
        });
      }
    },
  );
}
