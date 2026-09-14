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

  if (!member) return { status: "NOT_FOUND" };

  if (member.role === "MANAGER") {
    return { status: "FORBIDDEN" };
  }

  const updatedMember = await prisma.projectMember.update({
    where: {
      id: memberId,
    },
    data: {
      role,
    },
  });

  return {
    status: "UPDATED",
    member: updatedMember,
  };
}

export async function deleteProjectMember(projectId: string, memberId: string) {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, id: memberId },
  });

  if (!member) return { status: "NOT_FOUND" };

  if (member.role === "MANAGER") {
    return { status: "FORBIDDEN" };
  }

  const deletedMember = await prisma.projectMember.delete({
    where: { id: memberId },
  });

  return {
    status: "DELETED",
    member: deletedMember,
  };
}

export async function getProjectMember(projectId: string, userId: string) {
  return prisma.projectMember.findFirst({
    where: { projectId, userId },
  });
}

export async function isProjectManager(projectId: string, userId: string) {
  const member = await getProjectMember(projectId, userId);

  return member?.role === "MANAGER";
}

export async function getProjectMemberById(
  projectId: string,
  memberId: string,
) {
  return prisma.projectMember.findFirst({
    where: {
      id: memberId,
      projectId,
    },
  });
}
