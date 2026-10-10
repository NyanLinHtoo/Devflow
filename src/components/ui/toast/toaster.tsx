"use client";

import { Toast, Toaster as ArkToaster } from "@ark-ui/react/toast";
import { toaster } from "@/lib/toaster";

const typeStyles: Record<string, string> = {
	success: "border-success/30 bg-success-surface text-success",
	error: "border-danger/30 bg-danger-surface text-danger",
	warning: "border-warning/30 bg-warning-surface text-warning",
	info: "border-border bg-surface text-foreground",
};

export function Toaster() {
	return (
		<ArkToaster toaster={toaster}>
			{(toast) => (
				<Toast.Root
					className={`w-80 max-w-[calc(100vw-2rem)] rounded-lg border p-4 shadow-lg ${
						typeStyles[toast.type ?? "info"]
					}`}>
					{toast.title && (
						<Toast.Title className="text-sm font-medium">
							{toast.title}
						</Toast.Title>
					)}
					{toast.description && (
						<Toast.Description className="mt-1 text-sm">
							{toast.description}
						</Toast.Description>
					)}
					<Toast.CloseTrigger className="mt-2 text-xs font-medium underline">
						Close
					</Toast.CloseTrigger>
				</Toast.Root>
			)}
		</ArkToaster>
	);
}
