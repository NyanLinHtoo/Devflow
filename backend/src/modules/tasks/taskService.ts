import prisma from "../../lib/prisma.js";
import { getProjectMemberById } from "../projectMember/projectMemberService.js";
import { toTaskResponse } from "./taskMapper.js";
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
    include: {
      assignedMember: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return toTaskResponse(newTask);
}

export async function getTasksByProjectId(projectId: string) {
  const tasksByProjectId = await prisma.task.findMany({
    where: { projectId },
    include: {
      assignedMember: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasksByProjectId.map(toTaskResponse);
}

export async function getTaskByIdAndProjectId(
  projectId: string,
  taskId: string,
) {
  const existingTask = await prisma.task.findFirst({
    where: {
      projectId,
      id: taskId,
    },
    include: {
      assignedMember: {
        include: {
          user: {
            select: { fullName: true, email: true },
          },
        },
      },
    },
  });

  if (!existingTask) {
    return null;
  }

  return toTaskResponse(existingTask);
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

  const task = await prisma.task.update({
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
    include: {
      assignedMember: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return toTaskResponse(task);
}

export async function deleteTask(projectId: string, taskId: string) {
  const existingTask = await getTaskByIdAndProjectId(projectId, taskId);

  if (!existingTask) {
    return null;
  }

  return prisma.task.delete({
    where: { id: taskId },
  });
}

export async function updateTaskAssignee(
  projectId: string,
  taskId: string,
  assignedMemberId: string | null,
) {
  const existingTask = await getTaskByIdAndProjectId(projectId, taskId);

  if (!existingTask) {
    return { status: "TASK_NOT_FOUND" as const };
  }

  if (assignedMemberId !== null) {
    const projectMember = await getProjectMemberById(
      projectId,
      assignedMemberId,
    );

    if (!projectMember) {
      return { status: "MEMBER_NOT_FOUND" as const };
    }
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      assignedMemberId,
    },
    include: {
      assignedMember: {
        include: {
          user: { select: { fullName: true, email: true } },
        },
      },
    },
  });

  return {
    status: assignedMemberId ? "ASSIGNED" : "UNASSIGNED",
    task: toTaskResponse(updatedTask),
  };
}
