"use client";

import type { InputHTMLAttributes } from "react";
import { useFormFieldContext } from "../form-field/context";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", disabled, ...props }: InputProps) {
	const field = useFormFieldContext();

	return (
		<input
			{...props}
			disabled={disabled}
			aria-describedby={
				field?.hasMessage ? field.messageId : props["aria-describedby"]
			}
			aria-invalid={field?.invalid ? true : props["aria-invalid"]}
			className={[
				"h-10 w-full rounded-md border border-border bg-surface px-3 text-base text-foreground",
				"transition-colors sm:text-sm",
				"placeholder:text-muted-foreground",
				"pointer-coarse:min-h-11",
				"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
				className,
			].join(" ")}
		/>
	);
}
