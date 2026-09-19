export type AssignedMember = {
	id: string;
	fullName: string;
	email: string;
};

export type Task = {
	id: string;
	title: string;
	description: string | null;
	projectId: string;
	status: "TODO" | "IN_PROGRESS" | "DONE";
	priority: "LOW" | "MEDIUM" | "HIGH";
	dueDate: string | null;
	assignedMember: AssignedMember | null;
	createdAt: string;
	updatedAt: string;
};

export type CreateTaskInput = {
	title: string;
	description?: string;
	priority?: "LOW" | "MEDIUM" | "HIGH";
	dueDate?: string;
};

export type UpdateTaskInput = {
	title?: string;
	description?: string | null;
	status?: "TODO" | "IN_PROGRESS" | "DONE";
	priority?: "LOW" | "MEDIUM" | "HIGH";
	dueDate?: string | null;
};

export type UpdateTaskAssigneeInput = {
	assignedMemberId: string | null;
};
