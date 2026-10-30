import prisma from "../../lib/prisma.js";
import { toProjectResponse } from "./projectMapper.js";
import type { CreateProjectInput, UpdateProjectInput } from "./projectTypes.js";

const projectInclude = {
  _count: { select: { tasks: true } },
  tasks: { where: { status: "DONE" }, select: { id: true } },
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

  return toProjectResponse(newProject);
}

export async function getProjectsByMemberId(userId: string) {
  const projects = await prisma.project.findMany({
    where: { projectMembers: { some: { userId } } },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      ...projectInclude,
      projectMembers: { where: { userId }, select: { role: true } },
    },
  });

  return projects.map(toProjectResponse);
}

export async function getProjectById(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, projectMembers: { some: { userId } } },
    include: {
      ...projectInclude,
      projectMembers: { where: { userId }, select: { role: true } },
    },
  });

  return project ? toProjectResponse(project) : null;
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
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

  return toProjectResponse(project);
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}
