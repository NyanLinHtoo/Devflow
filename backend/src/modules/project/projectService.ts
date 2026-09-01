import prisma from "../../lib/prisma.js";
import { CreateProjectInput } from "./projectTypes.js";

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
  const projectsById = await prisma.project.findMany({
    where: { id: projectId, ownerId },
  });

  return projectsById;
}
