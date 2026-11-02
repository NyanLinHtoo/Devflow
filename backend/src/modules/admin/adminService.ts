import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";
import { withSerializableRetry } from "../../lib/transactions.js";
import { toAdminUserResponse } from "./adminMapper.js";
import type { ListUsersQuery, UpdateUserRoleInput } from "./adminTypes.js";

const adminUserSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  emailVerifiedAt: true,
  createdAt: true,
  _count: { select: { projectMembers: true } },
} as const;

export async function listUsers(input: ListUsersQuery) {
  const where: Prisma.UserWhereInput = {};

  if (input.role) {
    where.role = input.role;
  }

  if (input.query) {
    where.OR = [
      { email: { contains: input.query, mode: "insensitive" } },
      { fullName: { contains: input.query, mode: "insensitive" } },
    ];
  }

  const skip = (input.page - 1) * input.pageSize;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: adminUserSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: input.pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map(toAdminUserResponse),
    total,
    page: input.page,
    pageSize: input.pageSize,
  };
}

export async function updateUserRole(
  actorId: string,
  targetUserId: string,
  input: UpdateUserRoleInput,
) {
  return withSerializableRetry(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true },
    });

    if (!target) {
      return { status: "NOT_FOUND" as const };
    }

    if (target.role === input.role) {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: targetUserId },
        select: adminUserSelect,
      });

      return { status: "UNCHANGED" as const, user: toAdminUserResponse(user) };
    }

    if (target.role === "ADMIN" && input.role !== "ADMIN") {
      const adminCount = await tx.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return { status: "LAST_ADMIN" as const };
      }
    }

    const user = await tx.user.update({
      where: { id: targetUserId },
      data: { role: input.role },
      select: adminUserSelect,
    });

    await tx.adminAuditLog.create({
      data: {
        actorId,
        targetUserId,
        action: "ROLE_CHANGED",
        fromRole: target.role,
        toRole: input.role,
        reason: input.reason,
      },
    });

    return { status: "UPDATED" as const, user: toAdminUserResponse(user) };
  });
}
