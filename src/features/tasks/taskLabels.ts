import type { Task } from "@/types/taskTypes";

export const taskStatusLabels: Record<Task["status"], string> = {
	TODO: "To do",
	IN_PROGRESS: "In progress",
	DONE: "Done",
};

export const taskPriorityLabels: Record<Task["priority"], string> = {
	LOW: "Low",
	MEDIUM: "Medium",
	HIGH: "High",
};
