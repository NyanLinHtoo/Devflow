"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { isApiError } from "@/lib/apiError";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
	const router = useRouter();
	const query = useCurrentUser();

	useEffect(() => {
		if (isApiError(query.error) && query.error.status === 401) {
			router.replace("/login");
		}
	}, [query.error, router]);

	return query;
}
