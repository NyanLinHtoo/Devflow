import * as argon2 from "argon2";
import crypto from "crypto";
import { Prisma } from "../../generated/prisma/client.js";
import { appError } from "../../lib/errors.js";
import prisma from "../../lib/prisma.js";
import { LoginInput, RegisterInput } from "./authTypes.js";

type RequestPasswordResetResult =
  | { status: "NOT_FOUND" }
  | { status: "COOLDOWN"; retryAt: Date }
  | { status: "CREATED"; rawToken: string; expiresAt: Date };

type RequestEmailVerificationResult =
  | { status: "NOT_FOUND" }
  | { status: "ALREADY_VERIFIED" }
  | { status: "COOLDOWN"; retryAt: Date }
  | { status: "CREATED"; rawToken: string; expiresAt: Date };

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw appError("userAlreadyExists");
  }

  const passwordHash = await argon2.hash(input.password);

  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
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
          role: true,
          timezone: true,
          bio: true,
          createdAt: true,
        },
      });

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
      const { rawToken, tokenHash } = generateToken();

      await tx.emailVerification.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
          lastRequestedAt: now,
          usedAt: null,
        },
      });

      return { user, rawToken, expiresAt };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw appError("userAlreadyExists");
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw appError("invalidCredentials");
  }

  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    input.password,
  );
  if (!isPasswordValid) {
    throw appError("invalidCredentials");
  }

  if (user.emailVerifiedAt === null) {
    throw appError("emailNotVerified");
  }

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    timezone: user.timezone,
    bio: user.bio,
    createdAt: user.createdAt,
  };
  return safeUser;
}

export async function createSession(userId: string) {
  const sessionLifetimeMs = 30 * 24 * 60 * 60 * 1000;

  const expiresAt = new Date(Date.now() + sessionLifetimeMs);

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

export async function rotateSession(
  sessionId: string,
  refreshTokenHash: string,
  expiresAt: Date,
) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { refreshTokenHash, expiresAt },
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
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      timezone: true,
      bio: true,
      createdAt: true,
    },
  });

  return user;
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      timezone: true,
      bio: true,
      createdAt: true,
    },
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

export function generateToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  return { rawToken, tokenHash };
}

export async function requestPasswordReset(
  email: string,
): Promise<RequestPasswordResetResult> {
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

  const { rawToken, tokenHash } = generateToken();

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

  return prisma.$transaction(async (tx) => {
    const claim = await tx.passwordResetToken.updateMany({
      where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });

    if (claim.count === 0) {
      return { status: "INVALID" as const };
    }

    await tx.user.update({
      where: { id: existingResetToken.userId },
      data: { passwordHash },
    });

    await tx.session.deleteMany({
      where: { userId: existingResetToken.userId },
    });

    return { status: "SUCCESS" as const };
  });
}

export async function requestEmailVerification(
  userId: string,
): Promise<RequestEmailVerificationResult> {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return { status: "NOT_FOUND" };
  }

  if (existingUser.emailVerifiedAt !== null) {
    return { status: "ALREADY_VERIFIED" };
  }

  const existingEmailVerification = await prisma.emailVerification.findUnique({
    where: { userId },
  });

  const now = new Date();
  const cooldownMs = 5 * 60 * 1000;

  if (existingEmailVerification) {
    const retryAt = new Date(
      existingEmailVerification.lastRequestedAt.getTime() + cooldownMs,
    );

    if (now < retryAt) {
      return {
        status: "COOLDOWN",
        retryAt,
      };
    }
  }

  const tokenLifetimeMs = 60 * 60 * 1000;
  const expiresAt = new Date(now.getTime() + tokenLifetimeMs);
  const { rawToken, tokenHash } = generateToken();

  const emailVerification = await prisma.emailVerification.upsert({
    where: { userId },
    update: { tokenHash, expiresAt, lastRequestedAt: now, usedAt: null },
    create: {
      userId,
      tokenHash,
      expiresAt,
      lastRequestedAt: now,
      usedAt: null,
    },
  });
  return {
    status: "CREATED",
    rawToken,
    expiresAt: emailVerification.expiresAt,
  };
}

export async function verifyEmail(token: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const now = new Date();

  const emailVerification = await prisma.emailVerification.findUnique({
    where: { tokenHash },
  });

  if (!emailVerification) {
    return {
      status: "NOT_FOUND",
    };
  }

  if (emailVerification.usedAt !== null) {
    return { status: "USED" };
  }

  if (emailVerification.expiresAt <= now) {
    return {
      status: "INVALID",
    };
  }

  return prisma.$transaction(async (tx) => {
    const claim = await tx.emailVerification.updateMany({
      where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });

    if (claim.count === 0) {
      return { status: "INVALID" as const };
    }

    await tx.user.update({
      where: { id: emailVerification.userId },
      data: {
        emailVerifiedAt: now,
      },
    });

    return { status: "SUCCESS" as const };
  });
}
