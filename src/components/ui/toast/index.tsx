"use client";

import { Toast, Toaster as ArkToaster } from "@ark-ui/react/toast";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info,
	X,
	type LucideIcon,
} from "lucide-react";
import { toaster } from "@/lib/toaster";

type ToastStyle = {
	container: string;
	icon: LucideIcon;
};

const toastStyles: Record<string, ToastStyle> = {
	success: {
		container: "border-success/30 bg-success-surface text-success",
		icon: CheckCircle2,
	},
	error: {
		container: "border-danger/30 bg-danger-surface text-danger",
		icon: AlertCircle,
	},
	warning: {
		container: "border-warning/30 bg-warning-surface text-warning",
		icon: AlertTriangle,
	},
	info: {
		container: "border-border bg-surface text-foreground",
		icon: Info,
	},
};

export function Toaster() {
	return (
		<ArkToaster toaster={toaster}>
			{(toast) => {
				const style = toastStyles[toast.type ?? "info"] ?? toastStyles.info;
				const Icon = style.icon;

				return (
					<Toast.Root
						className={`flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border p-4 shadow-lg ${style.container}`}>
						<Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />

						<div className="min-w-0 flex-1">
							{toast.title ? (
								<Toast.Title className="text-sm font-semibold">
									{toast.title}
								</Toast.Title>
							) : null}

							{toast.description ? (
								<Toast.Description className="mt-1 text-sm opacity-90">
									{toast.description}
								</Toast.Description>
							) : null}
						</div>

						<Toast.CloseTrigger
							aria-label="Close notification"
							className="-mt-1 -mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100">
							<X size={16} />
						</Toast.CloseTrigger>
					</Toast.Root>
				);
			}}
		</ArkToaster>
	);
}
