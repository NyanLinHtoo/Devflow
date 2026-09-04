import { z } from "zod";
import { createTaskSchema } from "./taskSchema.js";

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
