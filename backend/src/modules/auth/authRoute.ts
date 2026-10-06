import * as argon2 from "argon2";
import type { FastifyInstance } from "fastify";
import { validate } from "../../lib/validation.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../email/emailService.js";
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
  rotateSession,
  updateSessionRefreshToken,
  verifyEmail,
} from "./authService.js";
import { RefreshTokenPayload } from "./authTypes.js";

const exposeAuthTokens = process.env.NODE_ENV !== "production";

const cookieDomain = process.env.COOKIE_DOMAIN;

const ACCESS_TOKEN_MAX_AGE = 60 * 15;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;
const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_MAX_AGE * 1000;

const accessCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ACCESS_TOKEN_MAX_AGE,
  ...(cookieDomain ? { domain: cookieDomain } : {}),
};

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: REFRESH_TOKEN_MAX_AGE,
  ...(cookieDomain ? { domain: cookieDomain } : {}),
};

const clearCookieOptions = {
  path: "/",
  ...(cookieDomain ? { domain: cookieDomain } : {}),
};

export function authRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 15 * 60 * 1000,
        },
      },
    },
    async (request, reply) => {
      const input = validate(registerSchema, request.body);

      const { user, rawToken, expiresAt } = await registerUser(input);

      const emailResult = await sendVerificationEmail(user.email, rawToken);

      if (emailResult.status !== "SENT") {
        request.log.warn(
          { status: emailResult.status },
          "Verification email was not sent",
        );
      }

      return reply.code(201).send({
        user,
        ...(exposeAuthTokens
          ? {
              emailVerification: {
                token: rawToken,
                expiresAt,
              },
            }
          : {}),
      });
    },
  );

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
      const input = validate(loginSchema, request.body);

      const user = await loginUser(input);

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

      reply.setCookie("access_token", accessToken, accessCookieOptions);
      reply.setCookie("refresh_token", refreshToken, refreshCookieOptions);

      return reply.code(200).send(user);
    },
  );

  app.get("/me", async (request, reply) => {
    try {
      await request.jwtVerify();

      const user = await getUserById(request.user.userId);

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

    reply.clearCookie("access_token", clearCookieOptions);
    reply.clearCookie("refresh_token", clearCookieOptions);

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

      const newRefreshToken = await reply.refreshJwtSign(
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
      const newRefreshTokenHash = await argon2.hash(newRefreshToken);

      await rotateSession(
        session.id,
        newRefreshTokenHash,
        new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      );

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

      reply.setCookie("access_token", accessToken, accessCookieOptions);
      reply.setCookie("refresh_token", newRefreshToken, refreshCookieOptions);

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
      const input = validate(resetPasswordSchema, request.body);

      const resetResult = await requestPasswordReset(input.email);

      if (resetResult.status === "COOLDOWN") {
        return reply.send({
          message: "If the account exists, a reset email will be sent.",
        });
      }

      if (resetResult.status === "CREATED") {
        const emailResult = await sendPasswordResetEmail(
          input.email,
          resetResult.rawToken,
        );

        if (emailResult.status !== "SENT") {
          request.log.warn(
            { status: emailResult.status },
            "Password reset email was not sent",
          );
        }

        return reply.send({
          message: "If the account exists, a reset email will be sent.",
          ...(exposeAuthTokens
            ? {
                resetToken: resetResult.rawToken,
                expiresAt: resetResult.expiresAt,
              }
            : {}),
        });
      }

      return reply.send({
        message: "If the account exists, a reset email will be sent.",
      });
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
      const input = validate(confirmPasswordResetSchema, request.body);

      const confirmPasswordReset = await resetPassword(
        input.token,
        input.password,
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
      const input = validate(verifyEmailSchema, request.query);

      const verifyEmailResult = await verifyEmail(input.token);

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
    },
  );

  app.post(
    "/resend-verification",
    { config: { rateLimit: { max: 5, timeWindow: 15 * 60 * 1000 } } },
    async (request, reply) => {
      const input = validate(resendVerificationSchema, request.body);

      const existingUser = await getUserByEmail(input.email);
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

      const emailResult = await sendVerificationEmail(
        existingUser.email,
        resendVerification.rawToken,
      );

      if (emailResult.status !== "SENT") {
        request.log.warn(
          { status: emailResult.status },
          "Verification email was not sent",
        );
      }

      return reply.code(200).send({
        message:
          "If the account exists and needs verification, a verification email will be sent.",
        ...(exposeAuthTokens
          ? {
              emailVerification: {
                token: resendVerification.rawToken,
                expiresAt: resendVerification.expiresAt,
              },
            }
          : {}),
      });
    },
  );
}
