"use client";

import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/state";
import { useLogout } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";

const container = "mx-auto w-full max-w-3xl px-4 py-8 sm:px-6";

export default function DashboardPage() {
	const router = useRouter();
	const logoutMutation = useLogout();

	const { data: user, isLoading, isError } = useRequireAuth();

	function handleLogout() {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				router.replace("/login");
			},
		});
	}

	if (isLoading) {
		return (
			<main className={container}>
				<LoadingState />
			</main>
		);
	}

	if (isError || !user) {
		return null;
	}

	return (
		<main className={container}>
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
					<p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
				</div>

				<Button
					variant="secondary"
					onClick={handleLogout}
					disabled={logoutMutation.isPending}>
					{logoutMutation.isPending ? "Signing out..." : "Sign out"}
				</Button>
			</div>
		</main>
	);
}
