"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import type { Task } from "@/types/taskTypes";
import { Dialog } from "@ark-ui/react/dialog";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";

type EditTaskDialogProps = {
	projectId: string;
	task: Task;
};

export default function EditTaskDialog({
	projectId,
	task,
}: EditTaskDialogProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button">Edit task</Button>
			</Dialog.Trigger>

			<DialogContent title="Editing task">
				{open && (
					<EditTaskForm
						task={task}
						projectId={projectId}
						onSuccess={() => setOpen(false)}
					/>
				)}

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
