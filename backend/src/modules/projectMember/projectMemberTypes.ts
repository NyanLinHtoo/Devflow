import { z } from "zod";
import { addProjectMemberSchema } from "./projectMemberSchema.js";

export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
