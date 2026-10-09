export type Project = {
	id: string;
	name: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
};

export type CreateProjectInput = {
	name: string;
	description?: string;
};

export type UpdateProjectInput = {
	projectId: string;
	name?: string;
	description?: string | null;
};
