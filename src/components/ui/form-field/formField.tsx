import {
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";

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

	const enhancedChild =
		hasMessage && isValidElement(children)
			? cloneElement(children as ReactElement<Record<string, unknown>>, {
					"aria-describedby": messageId,
					"aria-invalid": error ? true : undefined,
				})
			: children;

	return (
		<div className="space-y-2">
			<label
				htmlFor={htmlFor}
				className="block text-sm font-medium text-gray-900">
				{label}
			</label>

			{enhancedChild}

			{error ? (
				<p id={messageId} role="alert" className="text-sm text-red-600">
					{error}
				</p>
			) : helperText ? (
				<p id={messageId} className="text-sm text-gray-500">
					{helperText}
				</p>
			) : null}
		</div>
	);
}
