"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { useDeleteProject } from "@/hooks/useProjects";
import { isApiError } from "@/lib/apiError";
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

	async function handleDelete() {
		try {
			await deleteProjectMutation.mutateAsync(projectId);
			router.replace("/projects");
		} catch (error) {
			if (isApiError(error) && error.status === 404) {
				router.replace("/projects");
			}
		}
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button type="button">Delete project</Button>
			</Dialog.Trigger>

			<DialogContent title="Delete project?">
				<Dialog.Description className="mt-2 text-sm text-muted-foreground">
					Are you sure you want to delete {projectName}? This action cannot be
					undone.
				</Dialog.Description>

				<div className="mt-6 flex justify-end gap-3">
					<Dialog.CloseTrigger asChild>
						<Button
							type="button"
							variant="secondary"
							disabled={deleteProjectMutation.isPending}>
							Cancel
						</Button>
					</Dialog.CloseTrigger>

					<Button
						type="button"
						variant="danger"
						onClick={handleDelete}
						disabled={deleteProjectMutation.isPending}>
						{deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</DialogContent>
		</Dialog.Root>
	);
}
