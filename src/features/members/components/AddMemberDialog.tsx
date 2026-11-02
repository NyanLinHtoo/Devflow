"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@ark-ui/react/dialog";
import { useState } from "react";
import AddMemberForm from "./AddMemberForm";

type AddMemberDialogProps = {
	projectId: string;
};

export default function AddMemberDialog({ projectId }: AddMemberDialogProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button">Add member</Button>
			</Dialog.Trigger>

			<DialogContent title="Add member">
				<AddMemberForm
					projectId={projectId}
					onSuccess={() => setOpen(false)}
					cancelTrigger={
						<Dialog.CloseTrigger asChild>
							<Button
								type="button"
								variant="secondary"
								className="w-full sm:w-auto">
								Cancel
							</Button>
						</Dialog.CloseTrigger>
					}
				/>
			</DialogContent>
		</Dialog.Root>
	);
}
