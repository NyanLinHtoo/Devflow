import prisma from "../../lib/prisma.js";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function getDashboardSummary(userId: string) {
  const memberships = await prisma.projectMember.findMany({
    where: { userId },
    select: { id: true, projectId: true },
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
      recentActivity: [],
    };
  }

  const projectIds = memberships.map((membership) => membership.projectId);
  const membershipIds = memberships.map((membership) => membership.id);

  const now = new Date();
  const weekFromNow = new Date(now.getTime() + WEEK_MS);

  const [
    openTaskCount,
    dueThisWeekCount,
    overdueCount,
    assignedTaskCount,
    distinctMembers,
    distinctManagers,
    upcomingTasks,
    recentTasks,
  ] = await Promise.all([
    prisma.task.count({
      where: { projectId: { in: projectIds }, status: { not: "DONE" } },
    }),
    prisma.task.count({
      where: {
        projectId: { in: projectIds },
        status: { not: "DONE" },
        dueDate: { gte: now, lte: weekFromNow },
      },
    }),
    prisma.task.count({
      where: {
        projectId: { in: projectIds },
        status: { not: "DONE" },
        dueDate: { lt: now },
      },
    }),
    prisma.task.count({
      where: {
        assignedMemberId: { in: membershipIds },
        status: { not: "DONE" },
      },
    }),
    prisma.projectMember.findMany({
      where: { projectId: { in: projectIds } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.projectMember.findMany({
      where: { projectId: { in: projectIds }, role: "MANAGER" },
      select: { userId: true },
      distinct: ["userId"],
    }),
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
    prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        projectId: true,
        project: { select: { name: true } },
        assignedMember: {
          select: { user: { select: { fullName: true } } },
        },
      },
    }),
  ]);

  return {
    projectCount: new Set(projectIds).size,
    openTaskCount,
    dueThisWeekCount,
    overdueCount,
    assignedTaskCount,
    memberCount: distinctMembers.length,
    managerCount: distinctManagers.length,
    upcomingTasks: upcomingTasks.map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString() ?? null,
      projectId: task.projectId,
      projectName: task.project.name,
      assigneeName: task.assignedMember?.user.fullName ?? null,
    })),
    recentActivity: recentTasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      updatedAt: task.updatedAt.toISOString(),
      projectId: task.projectId,
      projectName: task.project.name,
      actorName: task.assignedMember?.user.fullName ?? null,
    })),
  };
}
