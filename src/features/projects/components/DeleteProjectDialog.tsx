"use client";

import { Button } from "@/components/ui/button";
import { useDeleteProject } from "@/hooks/useProjects";
import { Dialog } from "@ark-ui/react/dialog";
import { useRouter } from "next/navigation";

type DeleteProjectDialogProps = {
	projectId: string;
	projectName: string;
};

export default function DeleteProjectDialog({
	projectId,
	projectName,
}: DeleteProjectDialogProps) {
	const deleteProjectMutation = useDeleteProject();
	const router = useRouter();

	function handleDelete() {
		deleteProjectMutation.mutate(projectId, {
			onSuccess: () => {
				router.replace("/projects");
			},
		});
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button type="button">Delete project</Button>
			</Dialog.Trigger>

			<Dialog.Backdrop className="fixed inset-0 bg-black/40" />

			<Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Content className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
					<Dialog.Title className="text-lg font-semibold text-gray-900">
						Delete project?
					</Dialog.Title>

					<Dialog.Description className="mt-2 text-sm text-gray-600">
						Are you sure you want to delete `{projectName}`? This action cannot
						be undone.
					</Dialog.Description>

					{deleteProjectMutation.error instanceof Error && (
						<p className="mt-3 text-sm text-red-600">
							{deleteProjectMutation.error.message}
						</p>
					)}

					<div className="mt-6 flex justify-end gap-3">
						<Dialog.CloseTrigger asChild>
							<Button type="button" disabled={deleteProjectMutation.isPending}>
								Cancel
							</Button>
						</Dialog.CloseTrigger>

						<Button
							type="button"
							onClick={handleDelete}
							disabled={deleteProjectMutation.isPending}>
							{deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
}
