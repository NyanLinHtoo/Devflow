import prisma from "../../lib/prisma.js";
import { LoginInput, RegisterInput } from "./authTypes.js";
import * as argon2 from "argon2";
import crypto from "crypto";

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await argon2.hash(input.password);

  const newUser = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      acceptedTerms: input.acceptedTerms,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
    },
  });
  return newUser;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    input.password,
  );
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  };
  return safeUser;
}

export async function createSession(userId: string) {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  const expiresAt = new Date(Date.now() + sevenDaysInMs);

  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  return session;
}

export async function updateSessionRefreshToken(
  sessionId: string,
  refreshTokenHash: string,
) {
  return prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      refreshTokenHash,
    },
  });
}

export async function getSessionById(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  return session;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, email: true, createdAt: true },
  });

  return user;
}

export async function deleteSessionById(sessionId: string) {
  await prisma.session.deleteMany({
    where: {
      id: sessionId,
    },
  });
}

export function generatePasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  return { rawToken, tokenHash };
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      status: "NOT_FOUND",
    };
  }

  const existingResetToken = await prisma.passwordResetToken.findUnique({
    where: { userId: user.id },
  });

  const now = new Date();

  const cooldownMs = 5 * 60 * 1000;
  const tokenLifetimeMs = 60 * 60 * 1000;

  if (existingResetToken) {
    const retryAt = new Date(
      existingResetToken.lastRequestedAt.getTime() + cooldownMs,
    );

    if (now < retryAt) {
      return {
        status: "COOLDOWN",
        retryAt,
      };
    }
  }

  const { rawToken, tokenHash } = generatePasswordResetToken();

  const expiresAt = new Date(now.getTime() + tokenLifetimeMs);

  const resetToken = await prisma.passwordResetToken.upsert({
    where: {
      userId: user.id,
    },
    update: {
      tokenHash,
      expiresAt,
      lastRequestedAt: now,
      usedAt: null,
    },
    create: {
      userId: user.id,
      tokenHash,
      expiresAt,
      lastRequestedAt: now,
    },
  });

  return {
    status: "CREATED",
    rawToken,
    expiresAt: resetToken.expiresAt,
  };
}

export async function resetPassword(token: string, password: string) {
  const now = new Date();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const existingResetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!existingResetToken) {
    return {
      status: "INVALID",
    };
  }

  if (existingResetToken.usedAt !== null) {
    return {
      status: "USED",
    };
  }

  if (existingResetToken.expiresAt <= now) {
    return {
      status: "EXPIRED",
    };
  }

  const passwordHash = await argon2.hash(password);

  const claim = await prisma.passwordResetToken.updateMany({
    where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
    data: { usedAt: now },
  });

  if (claim.count === 0) {
    return { status: "INVALID" };
  }

  await prisma.user.update({
    where: { id: existingResetToken.userId },
    data: { passwordHash },
  });

  await prisma.session.deleteMany({
    where: { userId: existingResetToken.userId },
  });

  return {
    status: "SUCCESS",
  };
}
