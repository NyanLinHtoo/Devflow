import prisma from "../../lib/prisma.js";
import type { CreateTaskInput } from "./taskTypes.js";

export async function createTask(projectId: string, input: CreateTaskInput) {
  const newTask = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate,
      projectId,
    },
  });

  return newTask;
}

export async function getTasksByProjectId(projectId: string) {
  const tasksByProjectId = await prisma.task.findMany({
    where: { projectId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasksByProjectId;
}
