import { z } from "zod";
import { createProjectSchema } from "./projectSchema.js";

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
