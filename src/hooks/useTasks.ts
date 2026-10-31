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
				exact: true,
			});

			await queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
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
				exact: true,
			});

			await queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks", updatedTask.id],
			});

			await queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
		},
	});
}

export function useDeleteTask(projectId: string) {
	const queryClient = useQueryClient();

	const listKey = ["projects", projectId, "tasks"];

	return useMutation({
		mutationFn: (taskId: string) =>
			apiFetch<{ message: string }>(`/projects/${projectId}/tasks/${taskId}`, {
				method: "DELETE",
			}),
		meta: { successMessage: "Task deleted" },

		onSuccess: (_data, taskId) => {
			queryClient.setQueryData<Task[]>(listKey, (tasks) =>
				tasks?.filter((task) => task.id !== taskId),
			);

			queryClient.invalidateQueries({ queryKey: listKey, exact: true });
			queryClient.invalidateQueries({
				queryKey: [...listKey, taskId],
				refetchType: "none",
			});
			queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
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
				exact: true,
			});

			await queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks", updatedTask.id],
			});

			await queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
		},
	});
}
