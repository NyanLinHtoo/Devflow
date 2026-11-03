import { apiFetch } from "@/lib/api";
import type { ProjectMember } from "@/types/projectMemberTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function membersKey(projectId: string) {
	return ["projects", projectId, "members"];
}

export function useProjectMembers(projectId: string) {
	return useQuery({
		queryKey: membersKey(projectId),
		queryFn: () => apiFetch<ProjectMember[]>(`/projects/${projectId}/members`),
		enabled: Boolean(projectId),
		refetchOnWindowFocus: "always",
	});
}

export function useAddProjectMember(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { email: string; role: "MANAGER" | "MEMBER" }) =>
			apiFetch<ProjectMember>(`/projects/${projectId}/members`, {
				method: "POST",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Member added" },

		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: membersKey(projectId),
			});
			void queryClient.invalidateQueries({
				queryKey: ["dashboard", "summary"],
				refetchType: "all",
			});
		},
	});
}

export function useUpdateProjectMemberRole(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			memberId,
			role,
		}: {
			memberId: string;
			role: "MANAGER" | "MEMBER";
		}) =>
			apiFetch<ProjectMember>(`/projects/${projectId}/members/${memberId}`, {
				method: "PATCH",
				body: JSON.stringify({ role }),
			}),
		meta: { successMessage: "Role updated" },

		onMutate: async ({ memberId, role }) => {
			await queryClient.cancelQueries({ queryKey: membersKey(projectId) });

			const previous = queryClient.getQueryData<ProjectMember[]>(
				membersKey(projectId),
			);

			queryClient.setQueryData<ProjectMember[]>(
				membersKey(projectId),
				(members) =>
					members?.map((member) =>
						member.id === memberId ? { ...member, role } : member,
					),
			);

			return { previous };
		},

		onError: (_error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(membersKey(projectId), context.previous);
			}
		},

		onSettled: () => {
			void queryClient.invalidateQueries({
				queryKey: membersKey(projectId),
			});
			void queryClient.invalidateQueries({
				queryKey: ["dashboard", "summary"],
				refetchType: "all",
			});
		},
	});
}

export function useRemoveProjectMember(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (memberId: string) =>
			apiFetch<{ message: string }>(
				`/projects/${projectId}/members/${memberId}`,
				{
					method: "DELETE",
				},
			),
		meta: { successMessage: "Member removed" },

		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: membersKey(projectId),
			});

			void queryClient.invalidateQueries({
				queryKey: ["projects", projectId, "tasks"],
			});
			void queryClient.invalidateQueries({
				queryKey: ["dashboard", "summary"],
				refetchType: "all",
			});
		},
	});
}
