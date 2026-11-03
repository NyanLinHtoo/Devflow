"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { useRemoveProjectMember } from "@/hooks/useProjectMembers";
import { Dialog } from "@ark-ui/react/dialog";
import { useState } from "react";

type RemoveMemberDialogProps = {
	projectId: string;
	memberId: string;
	memberName: string;
};

export default function RemoveMemberDialog({
	projectId,
	memberId,
	memberName,
}: RemoveMemberDialogProps) {
	const [open, setOpen] = useState(false);
	const removeMember = useRemoveProjectMember(projectId);

	return (
		<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button" variant="secondary" size="sm">
					Remove
				</Button>
			</Dialog.Trigger>

			<DialogContent title="Remove member?">
				<Dialog.Description className="mt-2 wrap-break-word text-sm text-muted-foreground">
					Remove {memberName} from this project? Any tasks assigned to them will
					be unassigned.
				</Dialog.Description>

				<div className="mt-6 flex justify-end gap-3">
					<Dialog.CloseTrigger asChild>
						<Button
							type="button"
							variant="secondary"
							disabled={removeMember.isPending}>
							Cancel
						</Button>
					</Dialog.CloseTrigger>

					<Button
						type="button"
						variant="danger"
						disabled={removeMember.isPending}
						onClick={() =>
							removeMember.mutate(memberId, {
								onSuccess: () => setOpen(false),
							})
						}>
						{removeMember.isPending ? "Removing..." : "Remove"}
					</Button>
				</div>
			</DialogContent>
		</Dialog.Root>
	);
}
