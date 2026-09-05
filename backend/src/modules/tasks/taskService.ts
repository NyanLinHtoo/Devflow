import prisma from "../../lib/prisma.js";
import type { CreateTaskInput, UpdateTaskInput } from "./taskTypes.js";

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

export async function getTaskByIdAndProjectId(
  projectId: string,
  taskId: string,
) {
  const getTaskByIdAndProjectId = await prisma.task.findFirst({
    where: {
      projectId,
      id: taskId,
    },
  });

  return getTaskByIdAndProjectId;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  const existingTask = await getTaskByIdAndProjectId(projectId, taskId);

  if (!existingTask) {
    return null;
  }

  return prisma.task.update({
    where: {
      id: taskId,
      projectId,
    },
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate,
      status: input.status,
    },
  });
}
