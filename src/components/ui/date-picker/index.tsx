"use client";

import { dateToInputValue } from "@/lib/date";
import { useFormFieldContext } from "../form-field/context";

type DatePickerProps = {
	id?: string;
	value: Date | null;
	onChange: (date: Date | null) => void;
	disabled?: boolean;
	className?: string;
};

export function DatePicker({
	id,
	value,
	onChange,
	disabled,
	className = "",
}: DatePickerProps) {
	const field = useFormFieldContext();

	return (
		<input
			id={id}
			type="date"
			value={value ? dateToInputValue(value) : ""}
			onChange={(event) => {
				const next = event.target.value;

				onChange(next ? new Date(`${next}T00:00:00`) : null);
			}}
			disabled={disabled}
			aria-describedby={field?.hasMessage ? field.messageId : undefined}
			aria-invalid={field?.invalid ? true : undefined}
			className={[
				"h-10 w-full rounded-md border border-border bg-surface px-3 text-base text-foreground",
				"transition-colors sm:text-sm",
				"pointer-coarse:min-h-11",
				"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
				className,
			].join(" ")}
		/>
	);
}
