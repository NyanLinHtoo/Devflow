import { z } from "zod";

const roles = ["MANAGER", "MEMBER"] as const;

export const addProjectMemberSchema = z.object({
  email: z.email(),
  role: z.enum(roles),
});
