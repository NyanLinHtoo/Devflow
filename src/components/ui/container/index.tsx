import type { ReactNode } from "react";

type ContainerProps = {
	children: ReactNode;
	className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
	return (
		<main id="main" className={`w-full px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
			{children}
		</main>
	);
}
