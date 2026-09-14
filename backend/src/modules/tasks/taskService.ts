import prisma from "../../lib/prisma.js";
import { getProjectMemberById } from "../projectMember/projectMemberService.js";
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

  const tasks = tasksByProjectId.map((task) => {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId,
      assignedMember: task.assignedMember
        ? {
            id: task.assignedMember.id,
            fullName: task.assignedMember.user.fullName,
            email: task.assignedMember.user.email,
          }
        : null,
    };
  });

  return tasks;
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

  const task = {
    id: existingTask.id,
    title: existingTask.title,
    description: existingTask.description,
    status: existingTask.status,
    priority: existingTask.priority,
    dueDate: existingTask.dueDate,
    projectId: existingTask.projectId,
    assignedMember: existingTask.assignedMember
      ? {
          id: existingTask.assignedMember.id,
          fullName: existingTask.assignedMember.user.fullName,
          email: existingTask.assignedMember.user.email,
        }
      : null,
  };

  return task;
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
    return { status: "TASK_NOT_FOUND" };
  }

  if (assignedMemberId !== null) {
    console.log("Here assignedMemberId !!!!!!!!!!!!!!!! not null");

    const projectMember = await getProjectMemberById(
      projectId,
      assignedMemberId,
    );

    if (!projectMember) {
      return { status: "MEMBER_NOT_FOUND" };
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assignedMemberId,
      },
    });

    return {
      status: "ASSIGNED",
      task: updatedTask,
    };
  }

  console.log("Here assignedMemberId null");

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      assignedMemberId: null,
    },
  });

  return {
    status: "UNASSIGNED",
    task: updatedTask,
  };
}
