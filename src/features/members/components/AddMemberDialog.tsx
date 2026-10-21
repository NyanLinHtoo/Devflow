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
				<AddMemberForm projectId={projectId} onSuccess={() => setOpen(false)} />

				<div className="mt-6 flex justify-end gap-3">
					<Dialog.CloseTrigger asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</Dialog.CloseTrigger>
				</div>
			</DialogContent>
		</Dialog.Root>
	);
}
