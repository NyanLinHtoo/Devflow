import { apiFetch } from "@/lib/api";
import type { Project } from "@/types/projectTypes";
import { useQuery } from "@tanstack/react-query";

export type DashboardUpcomingTask = {
	id: string;
	title: string;
	priority: "LOW" | "MEDIUM" | "HIGH";
	dueDate: string | null;
	projectId: string;
	projectName: string;
	assigneeName: string | null;
};

export type DashboardSummary = {
	projectCount: number;
	openTaskCount: number;
	dueThisWeekCount: number;
	overdueCount: number;
	assignedTaskCount: number;
	memberCount: number;
	managerCount: number;
	upcomingTasks: DashboardUpcomingTask[];
	recentProjects: Project[];
	projectsThisMonth: number;
};

export function dashboardSummaryQueryOptions() {
	return {
		queryKey: ["dashboard", "summary"] as const,
		queryFn: () => apiFetch<DashboardSummary>("/dashboard/summary"),
		staleTime: 60_000,
	};
}

export function useDashboardSummary() {
	return useQuery(dashboardSummaryQueryOptions());
}
