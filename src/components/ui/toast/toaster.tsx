"use client";

import { Toast, Toaster as ArkToaster } from "@ark-ui/react/toast";
import { toaster } from "@/lib/toaster";

const typeStyles: Record<string, string> = {
	success: "border-green-200 bg-green-50 text-green-900",
	error: "border-red-200 bg-red-50 text-red-900",
	warning: "border-amber-200 bg-amber-50 text-amber-900",
	info: "border-gray-200 bg-white text-gray-900",
};

export function Toaster() {
	return (
		<ArkToaster toaster={toaster}>
			{(toast) => (
				<Toast.Root
					className={`w-80 rounded-lg border p-4 shadow-lg ${
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
