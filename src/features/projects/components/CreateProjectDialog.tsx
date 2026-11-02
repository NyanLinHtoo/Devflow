"use client";

import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@ark-ui/react/dialog";
import { useState } from "react";
import CreateProjectForm from "./CreateProjectForm";

export default function CreateProjectDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button">New project</Button>
			</Dialog.Trigger>

			<DialogContent title="Creating project">
				<CreateProjectForm
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
