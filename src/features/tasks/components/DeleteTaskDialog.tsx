"use client";

import { Button } from "@/components/ui/button";
import { useDeleteTask } from "@/hooks/useTasks";
import { Dialog } from "@ark-ui/react/dialog";

type DeleteTaskDialogProps = {
	projectId: string;
	taskId: string;
	taskTitle: string;
};

export default function DeleteTaskDialog({
	projectId,
	taskId,
	taskTitle,
}: DeleteTaskDialogProps) {
	const deleteTaskMutation = useDeleteTask(projectId);

	function handleDelete() {
		deleteTaskMutation.mutate(taskId);
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button type="button">Delete task</Button>
			</Dialog.Trigger>

			<Dialog.Backdrop className="fixed inset-0 bg-black/40" />

			<Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Content className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
					<Dialog.Title className="text-lg font-semibold text-gray-900">
						Delete task?
					</Dialog.Title>

					<Dialog.Description className="mt-2 text-sm text-gray-600">
						Are you sure you want to delete `{taskTitle}`? This action cannot be
						undone.
					</Dialog.Description>

					{deleteTaskMutation.error instanceof Error && (
						<p className="mt-3 text-sm text-red-600">
							{deleteTaskMutation.error.message}
						</p>
					)}

					<div className="mt-6 flex justify-end gap-3">
						<Dialog.CloseTrigger asChild>
							<Button type="button" disabled={deleteTaskMutation.isPending}>
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
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
}
