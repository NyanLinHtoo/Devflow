import type { ReactNode } from "react";

type SkeletonProps = {
	className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
	return (
		<div aria-hidden="true" className={`skeleton rounded-md ${className}`} />
	);
}

type SkeletonTextProps = {
	lines?: number;
	className?: string;
};

export function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps) {
	return (
		<div aria-hidden="true" className={`space-y-2 ${className}`}>
			{Array.from({ length: lines }).map((_, index) => (
				<Skeleton
					key={index}
					className={`h-3 ${index === lines - 1 ? "w-2/3" : "w-full"}`}
				/>
			))}
		</div>
	);
}

type LoadingRegionProps = {
	label: string;
	children: ReactNode;
	className?: string;
};

export function LoadingRegion({
	label,
	children,
	className = "",
}: LoadingRegionProps) {
	return (
		<div
			role="status"
			aria-busy="true"
			aria-live="polite"
			className={className}>
			<span className="sr-only">{label}</span>
			<div aria-hidden="true">{children}</div>
		</div>
	);
}
