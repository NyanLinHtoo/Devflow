import prisma from "../../lib/prisma.js";
import type {
  AddProjectMemberInput,
  UpdateProjectMemberRoleInput,
} from "./projectMemberTypes.js";

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: AddProjectMemberInput["role"],
) {
  return prisma.projectMember.create({
    data: {
      projectId,
      userId,
      role,
    },
  });
}

export async function getProjectMembers(projectId: string) {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export async function updateProjectMemberRole(
  projectId: string,
  memberId: string,
  role: UpdateProjectMemberRoleInput["role"],
) {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, id: memberId },
  });

  if (!member) return null;

  return prisma.projectMember.update({
    where: {
      id: memberId,
    },
    data: {
      role,
    },
  });
}

export async function deleteProjectMember(projectId: string, memberId: string) {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, id: memberId },
  });

  if (!member) return null;

  return prisma.projectMember.delete({
    where: { id: memberId },
  });
}
