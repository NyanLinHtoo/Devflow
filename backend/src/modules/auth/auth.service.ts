import prisma from "../../lib/prisma.js";
import { LoginInput, RegisterInput } from "./auth.types.js";
import * as argon2 from "argon2";

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
    select: { id: true, email: true },
  });

  return user;
}
