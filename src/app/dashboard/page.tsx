"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingState } from "@/components/ui/state";
import { useLogout } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";

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
			<Container>
				<LoadingState />
			</Container>
		);
	}

	if (isError || !user) {
		return null;
	}

	return (
		<Container>
			<PageHeader
				title="Dashboard"
				description={user.email}
				actions={
					<Button
						variant="secondary"
						onClick={handleLogout}
						disabled={logoutMutation.isPending}>
						{logoutMutation.isPending ? "Signing out..." : "Sign out"}
					</Button>
				}
			/>
		</Container>
	);
}
