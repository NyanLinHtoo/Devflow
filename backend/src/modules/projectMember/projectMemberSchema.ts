import { z } from "zod";

const roles = ["MANAGER", "MEMBER"] as const;

export const projectMemberParamsSchema = z.object({
  projectId: z.uuid(),
  memberId: z.uuid(),
});

export const projectParamsSchema = z.object({
  projectId: z.uuid(),
});

export const addProjectMemberSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  role: z.enum(roles),
});

export const updateProjectMemberRoleSchema = z.object({
  role: z.enum(roles),
});
