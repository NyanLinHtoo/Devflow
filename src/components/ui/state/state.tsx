import type { ReactNode } from "react";

type LoadingStateProps = {
	label?: string;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
	return <p className="text-sm text-gray-600">{label}</p>;
}

export function ErrorState({ message }: { message: string }) {
	return (
		<p role="alert" className="text-sm text-red-600">
			{message}
		</p>
	);
}

export function EmptyState({ children }: { children: ReactNode }) {
	return <p className="text-sm text-gray-600">{children}</p>;
}
