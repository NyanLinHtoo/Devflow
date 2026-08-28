import type { RegisterFormData } from "@/features/auth/schemas/registerSchema";
import { apiFetch } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterFormData) =>
			apiFetch("/auth/register", {
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
