"use client";

import { Button } from "@/components/ui/button";
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

			<Dialog.Backdrop className="fixed inset-0 bg-black/40" />

			<Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Content className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-lg">
					<Dialog.Title className="text-lg font-semibold text-foreground">
						Editing task
					</Dialog.Title>

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
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
}
