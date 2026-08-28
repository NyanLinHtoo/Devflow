"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
	const router = useRouter();

	const { data: user, isLoading: isUserLoading, isError } = useCurrentUser();

	useEffect(() => {
		if (isError) {
			router.replace("/login");
		}
	}, [isError, router]);

	if (isUserLoading) {
		return <p>Loading...</p>;
	}

	if (isError) return router.replace("/login");

	if (isError || !user) {
		return null;
	}

	return (
		<main>
			<h1>Dashboard</h1>
			<p>{user.email}</p>
		</main>
	);
}
