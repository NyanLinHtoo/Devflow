import { z } from "zod";
import { createTaskSchema, updateTaskSchema } from "./taskSchema.js";

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
