"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import type { Task } from "@/types/taskTypes";
import { Dialog } from "@ark-ui/react/dialog";
import { useRouter } from "next/navigation";
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
	const router = useRouter();

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
						onNotFound={() => {
							setOpen(false);
							router.replace(`/projects/${projectId}`);
						}}
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
				)}
			</DialogContent>
		</Dialog.Root>
	);
}
