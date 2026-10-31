"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { getInitials } from "@/lib/initials";
import { roleLabels } from "@/lib/roles";
import type { CurrentUser } from "@/types/authTypes";
import { useRouter } from "next/navigation";

type ProfileHeaderProps = {
	user: CurrentUser;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
	const logoutMutation = useLogout();
	const router = useRouter();

	function handleLogout() {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				router.replace("/login");
			},
		});
	}

	function scrollToProfile() {
		document
			.getElementById("profile-info")
			?.scrollIntoView({ behavior: "smooth" });
	}

	return (
		<div>
			<div className="relative h-28 overflow-hidden rounded-lg border border-border bg-linear-to-br from-surface-muted to-surface">
				<div className="profile-cover-grid absolute inset-0 opacity-40" />
			</div>

			<div className="-mt-9 flex flex-wrap items-end gap-4 px-5">
				<div className="flex size-[78px] shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground ring-4 ring-surface">
					{getInitials(user.fullName)}
				</div>

				<div className="min-w-0 flex-1">
					<h1 className="text-2xl font-semibold tracking-tight">
						{user.fullName}
					</h1>

					<div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
						<span className="truncate">{user.email}</span>

						<span className="rounded-full bg-success-surface px-2 py-0.5 text-xs font-medium text-success">
							{roleLabels[user.role]}
						</span>

						<span>·</span>

						<span>
							Joined{" "}
							{new Date(user.createdAt).toLocaleDateString(undefined, {
								month: "short",
								year: "numeric",
							})}
						</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 pb-1">
					<Button
						variant="secondary"
						onClick={handleLogout}
						disabled={logoutMutation.isPending}>
						{logoutMutation.isPending ? "Signing out..." : "Sign out"}
					</Button>
					<Button type="button" onClick={scrollToProfile}>
						Edit profile
					</Button>
				</div>
			</div>
		</div>
	);
}
