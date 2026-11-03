import type { ReactNode } from "react";

export function ErrorState({ message }: { message: string }) {
	return (
		<p role="alert" className="text-sm text-danger">
			{message}
		</p>
	);
}

export function EmptyState({ children }: { children: ReactNode }) {
	return <p className="text-sm text-muted-foreground">{children}</p>;
}
