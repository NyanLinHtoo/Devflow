import { apiFetch } from "@/lib/api";
import type { Task } from "@/types/taskTypes";
import { useQuery } from "@tanstack/react-query";

export type MyTask = Task & {
	projectName: string;
};

export function useMyTasks() {
	return useQuery({
		queryKey: ["tasks", "mine"],
		queryFn: () => apiFetch<MyTask[]>("/tasks/mine"),
	});
}
