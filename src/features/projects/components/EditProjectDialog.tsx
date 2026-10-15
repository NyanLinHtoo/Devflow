"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import type { Project } from "@/types/projectTypes";
import { Dialog } from "@ark-ui/react/dialog";
import { useState } from "react";
import EditProjectForm from "./EditProjectForm";

type EditProjectFormProps = {
	project: Project;
};

export default function EditProjectDialog({ project }: EditProjectFormProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button">Edit project</Button>
			</Dialog.Trigger>

			<DialogContent title="Editing project">
				<EditProjectForm project={project} onSuccess={() => setOpen(false)} />

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
