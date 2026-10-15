"use client";

import { Dialog } from "@ark-ui/react/dialog";
import type { ReactNode } from "react";

type DialogContentProps = {
	title: string;
	children: ReactNode;
};

export function DialogContent({ title, children }: DialogContentProps) {
	return (
		<>
			<Dialog.Backdrop className="fixed inset-0 bg-black/40" />

			<Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Content className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-lg">
					<Dialog.Title className="text-lg font-semibold text-foreground">
						{title}
					</Dialog.Title>

					{children}
				</Dialog.Content>
			</Dialog.Positioner>
		</>
	);
}
