import { getInitials } from "@/lib/initials";
import { roleLabels } from "@/lib/roles";
import type { CurrentUser } from "@/types/authTypes";

type ProfileHeaderProps = {
	user: CurrentUser;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
	return (
		<div>
			<div className="h-28 rounded-lg border border-border bg-linear-to-br from-surface-muted to-surface" />

			<div className="-mt-9 flex flex-wrap items-end gap-4 px-5">
				<div className="flex size-[78px] shrink-0 items-center justify-center rounded-full bg-indigo-600 text-2xl font-semibold text-white ring-4 ring-surface">
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
			</div>
		</div>
	);
}
