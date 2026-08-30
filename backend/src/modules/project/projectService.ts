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
