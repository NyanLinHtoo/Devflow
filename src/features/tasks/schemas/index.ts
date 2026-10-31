import { z } from "zod";

const priority = ["LOW", "MEDIUM", "HIGH"] as const;
const status = ["TODO", "IN_PROGRESS", "DONE"] as const;

export const createTaskSchema = z.object({
	title: z
		.string()
		.min(2, "Title must be at least 2 characters")
		.max(100, "Title must be at most 100 characters"),

	description: z
		.string()
		.max(500, "Description must be at most 500 characters")
		.optional(),

	priority: z.enum(priority),
	dueDate: z.string().optional(),
});

export const updateTaskSchema = z
	.object({
		title: z
			.string()
			.min(2, "Title must be at least 2 characters")
			.max(100, "Title must be at most 100 characters")
			.optional(),

		description: z
			.string()
			.max(500, "Description must be at most 500 characters")
			.optional(),

		priority: z.enum(priority).optional(),
		dueDate: z.string().optional(),

		status: z.enum(status).optional(),
	})
	.refine((data) => Object.values(data).some((value) => value !== undefined), {
		message: "At least one field must be provided",
	});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
