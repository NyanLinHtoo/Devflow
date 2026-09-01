import prisma from "../../lib/prisma.js";
import type { CreateProjectInput, UpdateProjectInput } from "./projectTypes.js";

export async function createProject(
  ownerId: string,
  input: CreateProjectInput,
) {
  const newProject = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      ownerId,
    },
  });
  return newProject;
}

export async function getProjectsByOwnerId(ownerId: string) {
  const projects = await prisma.project.findMany({
    where: { ownerId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export async function getProjectById(projectId: string, ownerId: string) {
  const projectsById = await prisma.project.findFirst({
    where: { id: projectId, ownerId },
  });

  return projectsById;
}

export async function updateProject(
  projectId: string,
  ownerId: string,
  input: UpdateProjectInput,
) {
  const project = await getProjectById(projectId, ownerId);

  if (!project) {
    return null;
  }

  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: input.name,
      description: input.description,
    },
  });
}

export async function deleteProject(projectId: string, ownerId: string) {
  const project = await getProjectById(projectId, ownerId);

  if (!project) {
    return null;
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return project;
}
