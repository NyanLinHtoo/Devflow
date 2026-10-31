import { PROJECT_STATUSES } from "@/types/projectTypes";
import { z } from "zod";

export const createProjectSchema = z.object({
	name: z
		.string()
		.min(2, "Project name must be at least 2 characters")
		.max(100, "Project name must be at most 100 characters"),

	description: z
		.string()
		.max(500, "Description must be at most 500 characters")
		.optional(),

	dueDate: z.string().optional(),
});

export const updateProjectSchema = z.object({
	name: z
		.string()
		.min(2, "Project name must be at least 2 characters")
		.max(100, "Project name must be at most 100 characters"),

	description: z
		.string()
		.max(500, "Description must be at most 500 characters")
		.nullable()
		.optional(),

	status: z.enum(PROJECT_STATUSES),
	dueDate: z.string().optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
