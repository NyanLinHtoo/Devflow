import type { ProjectStatus } from "@/types/projectTypes";

export const projectStatusLabels: Record<ProjectStatus, string> = {
	PLANNING: "Planning",
	IN_PROGRESS: "In progress",
	IN_REVIEW: "In review",
	COMPLETED: "Completed",
};

export const projectStatusOptions = (
	Object.entries(projectStatusLabels) as [ProjectStatus, string][]
).map(([value, label]) => ({ value, label }));

export const projectStatusChipClasses: Record<ProjectStatus, string> = {
	PLANNING: "bg-surface-muted text-muted-foreground",
	IN_PROGRESS: "bg-warning-surface text-warning",
	IN_REVIEW: "bg-success-surface text-success",
	COMPLETED: "bg-primary text-primary-foreground",
};
