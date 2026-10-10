import type { ReactNode } from "react";

type LoadingStateProps = {
	label?: string;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
	return <p className="text-sm text-muted-foreground">{label}</p>;
}

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
