import { z } from "zod";
import { registerSchema } from "./auth.schema.js";

export type RegisterInput = z.infer<typeof registerSchema>;
