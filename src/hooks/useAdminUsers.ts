"use client";

import { apiFetch } from "@/lib/api";
import type { AdminUser, AdminUsersResponse } from "@/types/adminTypes";
import type { AccountRole } from "@/types/authTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type AdminUsersParams = {
	query: string;
	role: AccountRole | "ALL";
	page: number;
	pageSize?: number;
};

function toSearchParams(params: AdminUsersParams) {
	const search = new URLSearchParams();
	const query = params.query.trim();

	if (query) {
		search.set("query", query);
	}

	if (params.role !== "ALL") {
		search.set("role", params.role);
	}

	search.set("page", String(params.page));
	search.set("pageSize", String(params.pageSize ?? 20));

	return search.toString();
}

export function useAdminUsers(params: AdminUsersParams, enabled = true) {
	return useQuery({
		queryKey: ["admin", "users", params],
		queryFn: () =>
			apiFetch<AdminUsersResponse>(`/admin/users?${toSearchParams(params)}`),
		placeholderData: (previous) => previous,
		enabled,
	});
}

export function useUpdateUserRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			userId,
			role,
			reason,
		}: {
			userId: string;
			role: AccountRole;
			reason: string;
		}) =>
			apiFetch<AdminUser>(`/admin/users/${userId}/role`, {
				method: "PATCH",
				body: JSON.stringify({ role, reason }),
			}),
		meta: { successMessage: "Role updated", skipErrorToast: true },

		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			void queryClient.invalidateQueries({ queryKey: ["currentUser"] });
		},
	});
}
