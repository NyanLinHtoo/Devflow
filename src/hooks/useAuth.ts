import type {
	ForgotPasswordFormData,
	LoginFormData,
	RegisterFormData,
} from "@/features/auth/schemas";
import { dashboardSummaryQueryOptions } from "@/hooks/useDashboard";
import { apiFetch } from "@/lib/api";
import type { CurrentUser } from "@/types/authTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type RegisterResponse = CurrentUser & {
	emailVerification?: {
		token: string;
		expiresAt: string;
	};
};

export function useLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: LoginFormData) =>
			apiFetch<CurrentUser>("/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			}),
		meta: { successMessage: "Signed in", skipErrorToast: true },

		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["currentUser"],
			});
			void queryClient.prefetchQuery(dashboardSummaryQueryOptions());
		},
	});
}

export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterFormData) =>
			apiFetch<RegisterResponse>("/auth/register", {
				method: "POST",
				body: JSON.stringify({
					fullName: data.fullName,
					email: data.email,
					password: data.password,
					acceptedTerms: data.acceptedTerms,
				}),
			}),
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiFetch<{ message: string }>("/auth/logout", {
				method: "POST",
			}),
		meta: { successMessage: "Signed out" },

		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: ["currentUser"],
			});
		},
	});
}

export function useForgotPassword() {
	return useMutation({
		mutationFn: (data: ForgotPasswordFormData) =>
			apiFetch<{ message: string }>("/auth/forgot-password", {
				method: "POST",
				body: JSON.stringify({ email: data.email }),
			}),
		meta: { skipErrorToast: true },
	});
}

export function useResetPassword() {
	return useMutation({
		mutationFn: (data: { token: string; password: string }) =>
			apiFetch<{ message: string }>("/auth/reset-password", {
				method: "POST",
				body: JSON.stringify(data),
			}),
		meta: { successMessage: "Password updated" },
	});
}

export function useVerifyEmail(token: string) {
	return useQuery({
		queryKey: ["verifyEmail", token],
		queryFn: () =>
			apiFetch<{ message: string }>(
				`/auth/verify-email?token=${encodeURIComponent(token)}`,
			),
		enabled: Boolean(token),
		retry: false,
	});
}

export function useResendVerification() {
	return useMutation({
		mutationFn: (data: { email: string }) =>
			apiFetch<{ message: string }>("/auth/resend-verification", {
				method: "POST",
				body: JSON.stringify(data),
			}),
	});
}
