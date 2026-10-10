import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", disabled, ...props }: InputProps) {
	return (
		<input
			disabled={disabled}
			className={[
				"h-10 w-full rounded-md border border-border bg-surface px-3 text-base text-foreground",
				"transition-colors sm:text-sm",
				"placeholder:text-muted-foreground",
				"pointer-coarse:min-h-11",
				"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
				className,
			].join(" ")}
			{...props}
		/>
	);
}
