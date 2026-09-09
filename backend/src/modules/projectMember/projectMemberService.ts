import prisma from "../../lib/prisma.js";
import type { AddProjectMemberInput } from "./projectMemberTypes.js";

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: AddProjectMemberInput["role"],
) {
  return prisma.projectMember.create({
    data: {
      projectId,
      userId,
      role,
    },
  });
}
