import { apiFetch } from "@/lib/api";
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

export type DashboardActivity = {
	id: string;
	title: string;
	status: "TODO" | "IN_PROGRESS" | "DONE";
	updatedAt: string;
	projectId: string;
	projectName: string;
	actorName: string | null;
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
	recentActivity: DashboardActivity[];
};

export function useDashboardSummary() {
	return useQuery({
		queryKey: ["dashboard", "summary"],
		queryFn: () => apiFetch<DashboardSummary>("/dashboard/summary"),
	});
}
