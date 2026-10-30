export const PROJECT_STATUSES = [
	"PLANNING",
	"IN_PROGRESS",
	"IN_REVIEW",
	"COMPLETED",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type Project = {
	id: string;
	name: string;
	description: string | null;
	status: ProjectStatus;
	dueDate: string | null;
	currentUserRole: "MANAGER" | "MEMBER" | null;
	totalTasks: number;
	doneTasks: number;
	progress: number;
	createdAt: string;
	updatedAt: string;
};

export type CreateProjectInput = {
	name: string;
	description?: string;
	status?: ProjectStatus;
	dueDate?: string;
};

export type UpdateProjectInput = {
	projectId: string;
	name?: string;
	description?: string | null;
	status?: ProjectStatus;
	dueDate?: string | null;
};
