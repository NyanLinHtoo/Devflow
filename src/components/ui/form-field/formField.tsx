import type { ReactNode } from "react";

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
	return (
		<div className="space-y-2">
			<label
				htmlFor={htmlFor}
				className="block text-sm font-medium text-gray-900">
				{label}
			</label>

			{children}

			{error ? (
				<p className="text-sm text-red-600">{error}</p>
			) : helperText ? (
				<p className="text-sm text-gray-500">{helperText}</p>
			) : null}
		</div>
	);
}
