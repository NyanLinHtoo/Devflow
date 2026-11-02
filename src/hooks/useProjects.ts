import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { isApiError } from "@/lib/apiError";
import { forgetProject } from "@/lib/cache";
import { toaster } from "@/lib/toaster";
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
		refetchOnWindowFocus: true,
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
				exact: true,
			});
		},
	});
}

export function useUpdateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ projectId, ...data }: UpdateProjectInput) =>
			apiFetch<Project>(`/projects/${projectId}`, {
				method: "PATCH",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Project updated", skipErrorToast: true },

		onError: (error, variables) => {
			if (isApiError(error) && error.status === 404) {
				forgetProject(queryClient, variables.projectId);
				toaster.error({
					title: "Project no longer available",
					description:
						"It may have been deleted, or you may have been removed. Your changes were not saved.",
				});
				return;
			}

			toaster.error({
				title: "Something went wrong",
				description: error instanceof Error ? error.message : undefined,
			});
		},

		onSuccess: async (updatedProject) => {
			await queryClient.invalidateQueries({
				queryKey: ["projects"],
				exact: true,
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
		meta: { successMessage: "Project deleted", skipErrorToast: true },

		onError: (error, projectId) => {
			if (isApiError(error) && error.status === 404) {
				forgetProject(queryClient, projectId);
				toaster.success({ title: "Project already deleted" });
				return;
			}

			toaster.error({
				title: "Something went wrong",
				description: error instanceof Error ? error.message : undefined,
			});
		},

		onSuccess: (_data, projectId) => {
			queryClient.cancelQueries({ queryKey: ["projects", projectId] });

			queryClient.setQueryData<Project[]>(["projects"], (projects) =>
				projects?.filter((project) => project.id !== projectId),
			);

			queryClient.invalidateQueries({ queryKey: ["projects"], exact: true });
			queryClient.invalidateQueries({
				queryKey: ["projects", projectId],
				refetchType: "none",
			});
		},
	});
}
