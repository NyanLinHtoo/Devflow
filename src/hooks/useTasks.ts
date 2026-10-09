import { apiFetch } from "@/lib/api";
import type {
	CreateTaskInput,
	Task,
	UpdateTaskAssigneeInput,
	UpdateTaskInput,
} from "@/types/taskTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTasks(projectId: string) {
	return useQuery({
		queryKey: ["projects", projectId, "tasks"],
		queryFn: () => apiFetch<Task[]>(`/projects/${projectId}/tasks`),
		enabled: Boolean(projectId),
	});
}

export function useTask(projectId: string, taskId: string) {
	return useQuery({
		queryKey: ["projects", projectId, "tasks", taskId],
		queryFn: () => apiFetch<Task>(`/projects/${projectId}/tasks/${taskId}`),
		enabled: Boolean(projectId && taskId),
	});
}

export function useCreateTask(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateTaskInput) =>
			apiFetch<Task>(`/projects/${projectId}/tasks`, {
				method: "POST",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Task created" },

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks"],
			});
		},
	});
}

export function useUpdateTask(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) =>
			apiFetch<Task>(`/projects/${projectId}/tasks/${taskId}`, {
				method: "PATCH",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Task updated" },

		onSuccess: async (updatedTask) => {
			await queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks"],
			});

			await queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks", updatedTask.id],
			});
		},
	});
}

export function useDeleteTask(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (taskId: string) =>
			apiFetch<{ message: string }>(`/projects/${projectId}/tasks/${taskId}`, {
				method: "DELETE",
			}),
		meta: { successMessage: "Task deleted" },

		onSuccess: async (_data, taskId) => {
			await queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks"],
			});

			queryClient.removeQueries({
				queryKey: ["projects", projectId, "tasks", taskId],
			});
		},
	});
}

export function useUpdateTaskAssignee(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			taskId,
			data,
		}: {
			taskId: string;
			data: UpdateTaskAssigneeInput;
		}) =>
			apiFetch<Task>(`/projects/${projectId}/tasks/${taskId}/assignee`, {
				method: "PATCH",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Assignee updated" },

		onSuccess: async (updatedTask) => {
			await queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks"],
			});

			await queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks", updatedTask.id],
			});
		},
	});
}
