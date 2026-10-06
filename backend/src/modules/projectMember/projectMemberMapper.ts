import type { Prisma } from "../../generated/prisma/client.js";

export type ProjectMemberWithUser = Prisma.ProjectMemberGetPayload<{
  include: {
    user: {
      select: {
        fullName: true;
        email: true;
      };
    };
  };
}>;

export function toProjectMemberResponse(member: ProjectMemberWithUser) {
  return {
    id: member.id,
    userId: member.userId,
    fullName: member.user.fullName,
    email: member.user.email,
    role: member.role,
  };
}
