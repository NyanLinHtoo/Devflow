import prisma from "../../lib/prisma.js";
import { toProjectResponse } from "./projectMapper.js";
import type { CreateProjectInput, UpdateProjectInput } from "./projectTypes.js";

export async function createProject(userId: string, input: CreateProjectInput) {
  const newProject = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      projectMembers: {
        create: {
          userId,
          role: "MANAGER",
        },
      },
    },
  });
  return toProjectResponse(newProject);
}

export async function getProjectsByMemberId(userId: string) {
  const projects = await prisma.project.findMany({
    where: { projectMembers: { some: { userId } } },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects.map(toProjectResponse);
}

export async function getProjectById(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, projectMembers: { some: { userId } } },
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
    },
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
