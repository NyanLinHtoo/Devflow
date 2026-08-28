import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { LoginFormData } from "@/features/auth/schemas/loginSchema";

export function useLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: LoginFormData) =>
			apiFetch("/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			}),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["currentUser"],
			});
		},
	});
}
