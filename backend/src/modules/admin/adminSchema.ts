import { z } from "zod";

const accountRoles = ["ADMIN", "MANAGER", "MEMBER"] as const;

export const listUsersQuerySchema = z.object({
  query: z.string().trim().max(100).optional(),
  role: z.enum(accountRoles).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(accountRoles),
  reason: z
    .string()
    .trim()
    .min(3, "Provide a short reason for this change")
    .max(500, "Reason must be at most 500 characters"),
});

export const adminUserParamsSchema = z.object({
  userId: z.uuid(),
});
