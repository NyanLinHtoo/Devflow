import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { isApiError } from "@/lib/apiError";
import { forgetProject } from "@/lib/cache";
import { deferToast, toaster } from "@/lib/toaster";
import type {
	CreateProjectInput,
	Project,
	UpdateProjectInput,
} from "@/types/projectTypes";

export function useProjects() {
	return useQuery({
		queryKey: ["projects"],
		queryFn: () => apiFetch<Project[]>("/projects"),
		staleTime: 60_000,
	});
}

export function useProject(projectId: string) {
	return useQuery({
		queryKey: ["projects", projectId],
		queryFn: () => apiFetch<Project>(`/projects/${projectId}`),
		enabled: Boolean(projectId),
		refetchOnWindowFocus: "always",
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

		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["projects"],
				exact: true,
			});
			void queryClient.invalidateQueries({
				queryKey: ["dashboard", "summary"],
				refetchType: "all",
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
				deferToast(() =>
					toaster.error({
						title: "Project no longer available",
						description:
							"It may have been deleted, or you may have been removed. Your changes were not saved.",
					}),
				);
				return;
			}

			deferToast(() =>
				toaster.error({
					title: "Something went wrong",
					description: error instanceof Error ? error.message : undefined,
				}),
			);
		},

		onSuccess: (updatedProject) => {
			void queryClient.invalidateQueries({
				queryKey: ["projects"],
				exact: true,
			});

			void queryClient.invalidateQueries({
				queryKey: ["projects", updatedProject.id],
			});
			void queryClient.invalidateQueries({
				queryKey: ["dashboard", "summary"],
				refetchType: "all",
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
				deferToast(() =>
					toaster.success({ title: "Project already deleted" }),
				);
				return;
			}

			deferToast(() =>
				toaster.error({
					title: "Something went wrong",
					description: error instanceof Error ? error.message : undefined,
				}),
			);
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
			queryClient.invalidateQueries({
				queryKey: ["dashboard", "summary"],
				refetchType: "all",
			});
		},
	});
}
