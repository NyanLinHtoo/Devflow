import prisma from "../../lib/prisma.js";
import { toProjectMemberResponse } from "./projectMemberMapper.js";
import type {
  AddProjectMemberInput,
  UpdateProjectMemberRoleInput,
} from "./projectMemberTypes.js";

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: AddProjectMemberInput["role"],
) {
  const member = await prisma.projectMember.create({
    data: {
      projectId,
      userId,
      role,
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
  });

  return toProjectMemberResponse(member);
}

export async function getProjectMembers(projectId: string) {
  const projectMembers = await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
  });

  return projectMembers.map(toProjectMemberResponse);
}

export async function updateProjectMemberRole(
  projectId: string,
  memberId: string,
  role: UpdateProjectMemberRoleInput["role"],
) {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, id: memberId },
  });

  if (!member) return { status: "NOT_FOUND" as const };

  if (member.role === "MANAGER" && role !== "MANAGER") {
    const managerCount = await prisma.projectMember.count({
      where: { projectId, role: "MANAGER" },
    });

    if (managerCount <= 1) {
      return { status: "LAST_MANAGER" as const };
    }
  }

  const updatedMember = await prisma.projectMember.update({
    where: {
      id: memberId,
    },
    data: {
      role,
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
  });

  return {
    status: "UPDATED" as const,
    member: toProjectMemberResponse(updatedMember),
  };
}

export async function deleteProjectMember(projectId: string, memberId: string) {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, id: memberId },
  });

  if (!member) return { status: "NOT_FOUND" as const };

  if (member.role === "MANAGER") {
    const managerCount = await prisma.projectMember.count({
      where: { projectId, role: "MANAGER" },
    });

    if (managerCount <= 1) {
      return { status: "LAST_MANAGER" as const };
    }
  }

  await prisma.projectMember.delete({
    where: { id: memberId },
  });

  return { status: "DELETED" as const };
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
