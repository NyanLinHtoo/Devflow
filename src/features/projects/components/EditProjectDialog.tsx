"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import type { Project } from "@/types/projectTypes";
import { Dialog } from "@ark-ui/react/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditProjectForm from "./EditProjectForm";

type EditProjectFormProps = {
	project: Project;
};

export default function EditProjectDialog({ project }: EditProjectFormProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button">Edit project</Button>
			</Dialog.Trigger>

			<DialogContent title="Editing project">
				<EditProjectForm
					project={project}
					onSuccess={() => setOpen(false)}
					onNotFound={() => {
						setOpen(false);
						router.replace("/projects");
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
			</DialogContent>
		</Dialog.Root>
	);
}
