"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
	const router = useRouter();
	const logoutMutation = useLogout();

	const { data: user, isLoading: isUserLoading, isError } = useCurrentUser();

	function handleLogout() {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				router.replace("/login");
			},
		});
	}

	useEffect(() => {
		if (isError) {
			router.replace("/login");
		}
	}, [isError, router]);

	if (isUserLoading) {
		return <p>Loading...</p>;
	}

	if (isError || !user) {
		return null;
	}

	return (
		<main>
			<h1>Dashboard</h1>
			<p>{user.email}</p>
			<Button onClick={handleLogout} disabled={logoutMutation.isPending}>
				{logoutMutation.isPending ? "Signing out..." : "Sign out"}
			</Button>
		</main>
	);
}
