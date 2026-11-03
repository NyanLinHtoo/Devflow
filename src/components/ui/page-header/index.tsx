import type { ReactNode } from "react";

type PageHeaderProps = {
	title: string;
	description?: ReactNode;
	actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
			<div className="min-w-0 lg:flex-1">
				<h1 className="wrap-break-word text-2xl font-semibold tracking-tight">
					{title}
				</h1>

				{description ? (
					<div className="mt-1 wrap-break-word text-sm text-muted-foreground">
						{description}
					</div>
				) : null}
			</div>

			{actions ? (
				<div className="flex flex-wrap gap-2 lg:shrink-0">{actions}</div>
			) : null}
		</div>
	);
}
