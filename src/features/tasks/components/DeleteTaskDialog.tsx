"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { useDeleteTask } from "@/hooks/useTasks";
import { Dialog } from "@ark-ui/react/dialog";
import { useRouter } from "next/navigation";

type DeleteTaskDialogProps = {
	projectId: string;
	taskId: string;
	taskTitle: string;
	redirectAfterDelete?: boolean;
};

export default function DeleteTaskDialog({
	projectId,
	taskId,
	taskTitle,
	redirectAfterDelete = false,
}: DeleteTaskDialogProps) {
	const deleteTaskMutation = useDeleteTask(projectId);

	const router = useRouter();

	function handleDelete() {
		deleteTaskMutation.mutate(taskId, {
			onSuccess: () => {
				if (redirectAfterDelete) {
					router.replace(`/projects/${projectId}`);
				}
			},
		});
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button type="button">Delete task</Button>
			</Dialog.Trigger>

			<DialogContent title="Delete task?">
				<Dialog.Description className="mt-2 text-sm text-muted-foreground">
					Are you sure you want to delete `{taskTitle}`? This action cannot be
					undone.
				</Dialog.Description>

				<div className="mt-6 flex justify-end gap-3">
					<Dialog.CloseTrigger asChild>
						<Button
							type="button"
							variant="secondary"
							disabled={deleteTaskMutation.isPending}>
							Cancel
						</Button>
					</Dialog.CloseTrigger>

					<Button
						type="button"
						onClick={handleDelete}
						disabled={deleteTaskMutation.isPending}>
						{deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</DialogContent>
		</Dialog.Root>
	);
}
