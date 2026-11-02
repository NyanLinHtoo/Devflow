import { z } from "zod";
import { listUsersQuerySchema, updateUserRoleSchema } from "./adminSchema.js";

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
