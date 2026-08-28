import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { CurrentUser } from "@/types/authTypes";

export function useCurrentUser() {
	return useQuery({
		queryKey: ["currentUser"],
		queryFn: () => apiFetch<CurrentUser>("/auth/me"),
	});
}
