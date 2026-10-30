import { apiFetch } from "@/lib/api";
import type { CurrentUser } from "@/types/authTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateProfileInput = {
	fullName?: string;
	timezone?: string | null;
	bio?: string | null;
};

export type ChangePasswordInput = {
	currentPassword: string;
	newPassword: string;
};

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateProfileInput) =>
			apiFetch<CurrentUser>("/users/me", {
				method: "PATCH",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Profile updated" },

		onSuccess: (user) => {
			queryClient.setQueryData(["currentUser"], user);
		},
	});
}

export function useChangePassword() {
	return useMutation({
		mutationFn: (data: ChangePasswordInput) =>
			apiFetch<{ message: string }>("/users/me/password", {
				method: "POST",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Password updated" },
	});
}

export function useDeleteAccount() {
	return useMutation({
		mutationFn: (password: string) =>
			apiFetch<{ message: string }>("/users/me", {
				method: "DELETE",
				body: JSON.stringify({ password }),
			}),
	});
}
