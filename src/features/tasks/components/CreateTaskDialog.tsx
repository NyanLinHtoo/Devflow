"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@ark-ui/react/dialog";
import { useState } from "react";
import CreateTaskForm from "./CreateTaskForm";

type CreateTaskDialogProps = {
	projectId: string;
};

export default function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button">Create task</Button>
			</Dialog.Trigger>

			<DialogContent title="Creating task">
				<CreateTaskForm
					projectId={projectId}
					onSuccess={() => setOpen(false)}
				/>

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
