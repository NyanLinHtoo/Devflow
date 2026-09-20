import type { Prisma } from "../../generated/prisma/client.js";

type TaskWithAssignedMember = Prisma.TaskGetPayload<{
  include: {
    assignedMember: {
      include: {
        user: {
          select: {
            fullName: true;
            email: true;
          };
        };
      };
    };
  };
}>;

export function toTaskResponse(task: TaskWithAssignedMember) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    projectId: task.projectId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    assignedMember: task.assignedMember
      ? {
          id: task.assignedMember.id,
          fullName: task.assignedMember.user.fullName,
          email: task.assignedMember.user.email,
        }
      : null,
  };
}
