import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../../lib/prisma.js";
import { getRecentProjectsByMemberId } from "../projects/projectService.js";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function getDashboardSummary(userId: string) {
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    select: {
      id: true,
      projectId: true,
      project: { select: { createdAt: true } },
    },
  });

  if (memberships.length === 0) {
    return {
      projectCount: 0,
      openTaskCount: 0,
      dueThisWeekCount: 0,
      overdueCount: 0,
      assignedTaskCount: 0,
      memberCount: 0,
      managerCount: 0,
      upcomingTasks: [],
      recentProjects: [],
      projectsThisMonth: 0,
    };
  }

  const projectIds = memberships.map((membership) => membership.projectId);
  const membershipIds = memberships.map((membership) => membership.id);

  const now = new Date();
  const weekFromNow = new Date(now.getTime() + WEEK_MS);

  const [taskCounts, projectMembers, recentProjects, upcomingTasks] =
    await Promise.all([
      prisma.$queryRaw<
        {
          openTaskCount: number;
          dueThisWeekCount: number;
          overdueCount: number;
          assignedTaskCount: number;
        }[]
      >(Prisma.sql`
      SELECT
        (COUNT(*) FILTER (WHERE "status" <> 'DONE'))::int AS "openTaskCount",
        (COUNT(*) FILTER (
          WHERE "status" <> 'DONE'
            AND "dueDate" >= ${now}
            AND "dueDate" <= ${weekFromNow}
        ))::int AS "dueThisWeekCount",
        (COUNT(*) FILTER (
          WHERE "status" <> 'DONE'
            AND "dueDate" < ${now}
        ))::int AS "overdueCount",
        (COUNT(*) FILTER (
          WHERE "status" <> 'DONE'
            AND "assignedMemberId" IN (${Prisma.join(membershipIds)})
        ))::int AS "assignedTaskCount"
      FROM "Task"
      WHERE "projectId" IN (${Prisma.join(projectIds)})
    `),
      prisma.projectMember.findMany({
        where: { projectId: { in: projectIds } },
        select: { userId: true, role: true },
      }),
      getRecentProjectsByMemberId(userId, 4),
      prisma.task.findMany({
        where: {
          projectId: { in: projectIds },
          status: { not: "DONE" },
          dueDate: { not: null },
        },
        orderBy: { dueDate: "asc" },
        take: 5,
        select: {
          id: true,
          title: true,
          priority: true,
          dueDate: true,
          projectId: true,
          project: { select: { name: true } },
          assignedMember: {
            select: { user: { select: { fullName: true } } },
          },
        },
      }),
    ]);

  const memberIds = new Set(projectMembers.map((member) => member.userId));
  const managerIds = new Set(
    projectMembers
      .filter((member) => member.role === "MANAGER")
      .map((member) => member.userId),
  );

  const counts = taskCounts[0] ?? {
    openTaskCount: 0,
    dueThisWeekCount: 0,
    overdueCount: 0,
    assignedTaskCount: 0,
  };

  const projectsThisMonth = memberships.filter((membership) => {
    const createdAt = membership.project.createdAt;

    return (
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    );
  }).length;

  return {
    projectCount: memberships.length,
    openTaskCount: counts.openTaskCount,
    dueThisWeekCount: counts.dueThisWeekCount,
    overdueCount: counts.overdueCount,
    assignedTaskCount: counts.assignedTaskCount,
    memberCount: memberIds.size,
    managerCount: managerIds.size,
    recentProjects,
    projectsThisMonth,
    upcomingTasks: upcomingTasks.map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString() ?? null,
      projectId: task.projectId,
      projectName: task.project.name,
      assigneeName: task.assignedMember?.user.fullName ?? null,
    })),
  };
}
