"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@ark-ui/react/dialog";
import { useState } from "react";
import CreateProjectForm from "./CreateProjectForm";

export default function CreateProjectDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
			<Dialog.Trigger asChild>
				<Button type="button">Create project</Button>
			</Dialog.Trigger>

			<Dialog.Backdrop className="fixed inset-0 bg-black/40" />

			<Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Content className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-lg">
					<Dialog.Title className="text-lg font-semibold text-foreground">
						Creating project
					</Dialog.Title>

					<CreateProjectForm onSuccess={() => setOpen(false)} />

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
