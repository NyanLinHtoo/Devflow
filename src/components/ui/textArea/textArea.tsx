import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className = "", ...props }: TextAreaProps) {
	return (
		<textarea
			className={[
				"min-h-24 w-full rounded-md border border-gray-300 text-black bg-white px-3 text-sm",
				"outline-none transition-colors",
				"placeholder:text-gray-400",
				"focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10",
				"disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60",
				className,
			].join(" ")}
			{...props}
		/>
	);
}
