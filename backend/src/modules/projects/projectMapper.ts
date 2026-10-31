type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED";
type ProjectRole = "MANAGER" | "MEMBER";

type ProjectMemberPreview = {
  userId: string;
  role: ProjectRole;
  user: { fullName: string };
};

type ProjectModel = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { tasks: number };
  tasks: { id: string }[];
  projectMembers?: ProjectMemberPreview[];
};

export function toProjectResponse(
  project: ProjectModel,
  currentUserId?: string,
) {
  const totalTasks = project._count.tasks;
  const doneTasks = project.tasks.length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const members = (project.projectMembers ?? []).slice(0, 4).map((member) => ({
    id: member.userId,
    fullName: member.user.fullName,
  }));

  const currentUserRole =
    project.projectMembers?.find((member) => member.userId === currentUserId)
      ?.role ?? null;

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    dueDate: project.dueDate?.toISOString() ?? null,
    currentUserRole,
    memberCount: project.projectMembers?.length ?? 0,
    members,
    totalTasks,
    doneTasks,
    progress,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}
