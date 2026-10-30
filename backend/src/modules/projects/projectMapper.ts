type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED";
type ProjectRole = "MANAGER" | "MEMBER";

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
  projectMembers?: { role: ProjectRole }[];
};

export function toProjectResponse(project: ProjectModel) {
  const totalTasks = project._count.tasks;
  const doneTasks = project.tasks.length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    dueDate: project.dueDate?.toISOString() ?? null,
    currentUserRole: project.projectMembers?.[0]?.role ?? null,
    totalTasks,
    doneTasks,
    progress,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}
