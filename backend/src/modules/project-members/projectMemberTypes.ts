import { z } from "zod";
import {
  addProjectMemberSchema,
  updateProjectMemberRoleSchema,
} from "./projectMemberSchema.js";

export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
export type UpdateProjectMemberRoleInput = z.infer<
  typeof updateProjectMemberRoleSchema
>;
