import type { QueryClient } from "@tanstack/react-query";
import type { Project } from "@/types/projectTypes";
import type { Task } from "@/types/taskTypes";

export function forgetProject(queryClient: QueryClient, projectId: string) {
	queryClient.setQueryData<Project[]>(["projects"], (projects) =>
		projects?.filter((project) => project.id !== projectId),
	);

	queryClient.invalidateQueries({
		queryKey: ["dashboard", "summary"],
		refetchType: "all",
	});
	queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
}

export function forgetTask(
	queryClient: QueryClient,
	projectId: string,
	taskId: string,
) {
	queryClient.setQueryData<Task[]>(
		["projects", projectId, "tasks"],
		(tasks) => tasks?.filter((task) => task.id !== taskId),
	);

	queryClient.invalidateQueries({
		queryKey: ["dashboard", "summary"],
		refetchType: "all",
	});
	queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
}
