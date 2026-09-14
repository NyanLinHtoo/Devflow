import { z } from "zod";
import { createTaskSchema, updateTaskSchema } from "./taskSchema.js";
import { updateTaskAssigneeSchema } from "./taskAssigneeSchema.js";

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskAssigneeSchemaInput = z.infer<
  typeof updateTaskAssigneeSchema
>;
