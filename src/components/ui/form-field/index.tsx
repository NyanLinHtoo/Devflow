"use client";

import type { ReactNode } from "react";
import { FormFieldContext } from "./context";

type FormFieldProps = {
	label: string;
	htmlFor: string;
	error?: string;
	helperText?: string;
	children: ReactNode;
};

export function FormField({
	label,
	htmlFor,
	error,
	helperText,
	children,
}: FormFieldProps) {
	const messageId = `${htmlFor}-message`;
	const hasMessage = Boolean(error || helperText);

	return (
		<FormFieldContext.Provider
			value={{ messageId, hasMessage, invalid: Boolean(error) }}>
			<div className="space-y-2">
				<label
					htmlFor={htmlFor}
					className="block text-sm font-medium text-foreground">
					{label}
				</label>

				{children}

				{error ? (
					<p id={messageId} role="alert" className="text-sm text-danger">
						{error}
					</p>
				) : helperText ? (
					<p id={messageId} className="text-sm text-muted-foreground">
						{helperText}
					</p>
				) : null}
			</div>
		</FormFieldContext.Provider>
	);
}
