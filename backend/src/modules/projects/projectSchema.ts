import { z } from "zod";

const projectStatus = [
  "PLANNING",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
] as const;

const dueDateSchema = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
});

export const projectParamsSchema = z.object({
  projectId: z.uuid(),
});

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be at most 100 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  status: z.enum(projectStatus).optional(),
  dueDate: dueDateSchema.optional(),
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
      .optional()
      .nullable(),

    status: z.enum(projectStatus).optional(),

    dueDate: dueDateSchema.optional().nullable(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });
