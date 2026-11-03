"use client";

import { ProfileSkeleton } from "@/components/loading";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/state";
import ChangePasswordForm from "@/features/profile/components/ChangePasswordForm";
import DeleteAccountDialog from "@/features/profile/components/DeleteAccountDialog";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ProfileInfoForm from "@/features/profile/components/ProfileInfoForm";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProfilePage() {
	const { data: user, isLoading, isError } = useRequireAuth();

	if (isLoading) {
		return (
			<Container>
				<ProfileSkeleton />
			</Container>
		);
	}

	if (isError) {
		return (
			<Container>
				<ErrorState message="Failed to load your profile." />
			</Container>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<Container>
			<ProfileHeader user={user} />

			<div className="mt-6 grid gap-6 lg:grid-cols-[196px_minmax(0,1fr)]">
				<aside className="lg:sticky lg:top-6 lg:self-start">
					<nav
						aria-label="Profile sections"
						className="flex gap-2 overflow-x-auto lg:flex-col">
						<a
							href="#profile-info"
							className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground">
							Profile
						</a>
						<a
							href="#profile-security"
							className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground">
							Security
						</a>
						<a
							href="#profile-danger"
							className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-danger hover:bg-danger-surface">
							Danger zone
						</a>
					</nav>
				</aside>

				<div className="space-y-6">
					<ProfileInfoForm user={user} />
					<ChangePasswordForm />

					<section
						id="profile-danger"
						className="scroll-mt-6 rounded-lg border border-danger/30 bg-danger-surface p-4">
						<h2 className="text-lg font-medium text-danger">Delete account</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							This permanently deletes your account and removes you from all
							projects. This cannot be undone.
						</p>

						<div className="mt-4">
							<DeleteAccountDialog />
						</div>
					</section>
				</div>
			</div>
		</Container>
	);
}
