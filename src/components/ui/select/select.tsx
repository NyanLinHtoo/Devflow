import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", ...props }: SelectProps) {
	return (
		<select
			className={[
				"h-10 w-full rounded-md border border-border bg-surface px-3 text-base text-foreground",
				"transition-colors sm:text-sm",
				"pointer-coarse:min-h-11",
				"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
				className,
			].join(" ")}
			{...props}></select>
	);
}
