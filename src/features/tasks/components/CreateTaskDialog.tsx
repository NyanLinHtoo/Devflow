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
