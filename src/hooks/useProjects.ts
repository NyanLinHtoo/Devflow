import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
	CreateProjectInput,
	Project,
	UpdateProjectInput,
} from "@/types/projectTypes";

export function useProjects() {
	return useQuery({
		queryKey: ["projects"],
		queryFn: () => apiFetch<Project[]>("/projects"),
	});
}

export function useProject(projectId: string) {
	return useQuery({
		queryKey: ["projects", projectId],
		queryFn: () => apiFetch<Project>(`/projects/${projectId}`),
		enabled: Boolean(projectId),
	});
}

export function useCreateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateProjectInput) =>
			apiFetch<Project>("/projects", {
				method: "POST",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Project created" },

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["projects"],
			});
		},
	});
}

export function useUpdateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ projectId, name, description }: UpdateProjectInput) =>
			apiFetch<Project>(`/projects/${projectId}`, {
				method: "PATCH",
				body: JSON.stringify({
					name,
					description,
				}),
			}),
		meta: { successMessage: "Project updated" },

		onSuccess: async (updatedProject) => {
			await queryClient.invalidateQueries({
				queryKey: ["projects"],
			});

			await queryClient.invalidateQueries({
				queryKey: ["projects", updatedProject.id],
			});
		},
	});
}

export function useDeleteProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (projectId: string) =>
			apiFetch<{ message: string }>(`/projects/${projectId}`, {
				method: "DELETE",
			}),
		meta: { successMessage: "Project deleted" },

		onSuccess: async (_data, projectId) => {
			await queryClient.invalidateQueries({
				queryKey: ["projects"],
			});

			queryClient.removeQueries({
				queryKey: ["projects", projectId],
			});
		},
	});
}
