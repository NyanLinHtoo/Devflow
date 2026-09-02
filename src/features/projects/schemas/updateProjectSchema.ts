import { z } from "zod";

export const updateProjectSchema = z.object({
	name: z
		.string()
		.min(2, "Project name must be at least 2 characters")
		.max(100, "Project name must be at most 100 characters"),

	description: z
		.string()
		.max(500, "Description must be at most 500 characters")
		.optional(),
});

export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
