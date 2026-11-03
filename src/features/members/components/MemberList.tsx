"use client";

import { MemberListSkeleton } from "@/components/loading";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { EmptyState, ErrorState } from "@/components/ui/state";
import {
	useProjectMembers,
	useUpdateProjectMemberRole,
} from "@/hooks/useProjectMembers";
import { roleLabels } from "@/lib/roles";
import AddMemberDialog from "./AddMemberDialog";
import RemoveMemberDialog from "./RemoveMemberDialog";

const roleOptions = [
	{ value: "MEMBER", label: "Member" },
	{ value: "MANAGER", label: "Manager" },
];

type MemberListProps = {
	projectId: string;
	currentUserId: string | undefined;
	canManage: boolean;
};

export default function MemberList({
	projectId,
	currentUserId,
	canManage,
}: MemberListProps) {
	const { data: members, isLoading, isError } = useProjectMembers(projectId);
	const updateRole = useUpdateProjectMemberRole(projectId);

	if (isLoading) {
		return <MemberListSkeleton />;
	}

	return (
		<section aria-labelledby="members-heading">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
				<h2 id="members-heading" className="text-lg font-medium">
					Members
				</h2>

				{canManage ? <AddMemberDialog projectId={projectId} /> : null}
			</div>

			{isError ? (
				<ErrorState message="Failed to load members." />
			) : !members || members.length === 0 ? (
				<EmptyState>No members yet.</EmptyState>
			) : (
				<Card className="p-0">
					<ul className="divide-y divide-border">
						{members.map((member) => {
							const isSelf = member.userId === currentUserId;
							const editable = canManage && !isSelf;

							return (
								<li
									key={member.id}
									className="flex flex-wrap items-center justify-between gap-3 p-4">
									<div className="min-w-0">
										<p className="truncate font-medium">
											{member.fullName}
											{isSelf ? " (you)" : ""}
										</p>

										<p className="truncate text-sm text-muted-foreground">
											{member.email}
										</p>
									</div>

									{editable ? (
										<div className="flex items-center gap-2">
											<Select
												aria-label={`Role for ${member.fullName}`}
												className="w-36"
												value={member.role}
												disabled={updateRole.isPending}
												onChange={(value) =>
													updateRole.mutate({
														memberId: member.id,
														role: value as "MANAGER" | "MEMBER",
													})
												}
												options={roleOptions}
											/>

											<RemoveMemberDialog
												projectId={projectId}
												memberId={member.id}
												memberName={member.fullName}
											/>
										</div>
									) : (
										<span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium">
											{roleLabels[member.role]}
										</span>
									)}
								</li>
							);
						})}
					</ul>
				</Card>
			)}
		</section>
	);
}
