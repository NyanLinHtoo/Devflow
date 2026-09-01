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
});

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .min(2, "Project name must be at least 2 characters")
      .max(100, "Project name must be at most 100 characters")
      .optional(),

    description: z
      .string()
      .max(500, "Description must be at most 500 characters")
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field must be provided",
  });
