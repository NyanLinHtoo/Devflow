import * as argon2 from "argon2";
import prisma from "../../lib/prisma.js";
import { withSerializableRetry } from "../../lib/transactions.js";
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  UpdateProfileInput,
} from "./userTypes.js";

const profileSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  timezone: true,
  bio: true,
  createdAt: true,
} as const;

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      fullName: input.fullName,
      timezone: input.timezone,
      bio: input.bio,
    },
    select: profileSelect,
  });
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    return { status: "NOT_FOUND" as const };
  }

  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    input.currentPassword,
  );

  if (!isPasswordValid) {
    return { status: "INVALID_PASSWORD" as const };
  }

  const passwordHash = await argon2.hash(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { status: "SUCCESS" as const };
}

export async function deleteAccount(userId: string, input: DeleteAccountInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true, role: true },
  });

  if (!user) {
    return { status: "NOT_FOUND" as const };
  }

  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    input.password,
  );

  if (!isPasswordValid) {
    return { status: "INVALID_PASSWORD" as const };
  }

  return withSerializableRetry(async (tx) => {
    const managerMemberships = await tx.projectMember.findMany({
      where: { userId, role: "MANAGER" },
      select: { projectId: true },
    });

    for (const membership of managerMemberships) {
      const managerCount = await tx.projectMember.count({
        where: { projectId: membership.projectId, role: "MANAGER" },
      });

      if (managerCount <= 1) {
        return { status: "LAST_MANAGER" as const };
      }
    }

    if (user.role === "ADMIN") {
      const adminCount = await tx.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return { status: "LAST_ADMIN" as const };
      }
    }

    await tx.user.delete({
      where: { id: userId },
    });

    return { status: "SUCCESS" as const };
  });
}
