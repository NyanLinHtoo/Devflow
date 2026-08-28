import { apiFetch } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			apiFetch<{ message: string }>("/auth/logout", {
				method: "POST",
			}),

		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: ["currentUser"],
			});
		},
	});
}
