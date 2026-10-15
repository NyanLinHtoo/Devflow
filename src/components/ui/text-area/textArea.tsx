import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className = "", ...props }: TextAreaProps) {
	return (
		<textarea
			className={[
				"min-h-24 w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground",
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
