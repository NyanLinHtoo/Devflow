import type { Prisma } from "../../generated/prisma/client.js";

export type AdminUserWithCount = Prisma.UserGetPayload<{
  select: {
    id: true;
    fullName: true;
    email: true;
    role: true;
    emailVerifiedAt: true;
    createdAt: true;
    _count: { select: { projectMembers: true } };
  };
}>;

export function toAdminUserResponse(user: AdminUserWithCount) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    projectCount: user._count.projectMembers,
  };
}
