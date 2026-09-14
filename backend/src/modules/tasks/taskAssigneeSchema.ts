import { z } from "zod";

export const updateTaskAssigneeSchema = z.object({
  assignedMemberId: z.uuid().nullable(),
});
