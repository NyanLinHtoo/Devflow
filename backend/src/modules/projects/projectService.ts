import prisma from "../../lib/prisma.js";
import { toProjectResponse } from "./projectMapper.js";
import type { CreateProjectInput, UpdateProjectInput } from "./projectTypes.js";

const projectInclude = {
  _count: { select: { tasks: true } },
  tasks: { where: { status: "DONE" }, select: { id: true } },
  projectMembers: {
    select: {
      userId: true,
      role: true,
      user: { select: { fullName: true } },
    },
  },
} as const;

export async function createProject(userId: string, input: CreateProjectInput) {
  const newProject = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      status: input.status,
      dueDate: input.dueDate,
      projectMembers: {
        create: {
          userId,
          role: "MANAGER",
        },
      },
    },
    include: projectInclude,
  });

  return toProjectResponse(newProject, userId);
}

export async function getProjectsByMemberId(userId: string) {
  const projects = await prisma.project.findMany({
    where: { projectMembers: { some: { userId } } },
    orderBy: {
      createdAt: "desc",
    },
    include: projectInclude,
  });

  return projects.map((project) => toProjectResponse(project, userId));
}

export async function getRecentProjectsByMemberId(
  userId: string,
  take: number,
) {
  const projects = await prisma.project.findMany({
    where: { projectMembers: { some: { userId } } },
    orderBy: {
      createdAt: "desc",
    },
    take,
    include: projectInclude,
  });

  return projects.map((project) => toProjectResponse(project, userId));
}

export async function getProjectById(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, projectMembers: { some: { userId } } },
    include: projectInclude,
  });

  return project ? toProjectResponse(project, userId) : null;
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
  userId: string,
) {
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: input.name,
      description: input.description,
      status: input.status,
      dueDate: input.dueDate,
    },
    include: projectInclude,
  });

  return toProjectResponse(project, userId);
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}
