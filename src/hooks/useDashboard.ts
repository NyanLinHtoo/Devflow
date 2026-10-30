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

export type DashboardSummary = {
	projectCount: number;
	openTaskCount: number;
	dueThisWeekCount: number;
	overdueCount: number;
	assignedTaskCount: number;
	memberCount: number;
	upcomingTasks: DashboardUpcomingTask[];
};

export function useDashboardSummary() {
	return useQuery({
		queryKey: ["dashboard", "summary"],
		queryFn: () => apiFetch<DashboardSummary>("/dashboard/summary"),
	});
}
