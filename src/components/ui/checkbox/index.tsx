"use client";

import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { useFormFieldContext } from "../form-field/context";

type CheckboxProps = {
	id?: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
	children: ReactNode;
};

export function Checkbox({
	id,
	checked,
	onCheckedChange,
	disabled,
	children,
}: CheckboxProps) {
	const field = useFormFieldContext();

	return (
		<ArkCheckbox.Root
			id={id}
			checked={checked}
			onCheckedChange={(details) => onCheckedChange(details.checked === true)}
			disabled={disabled}
			aria-describedby={field?.hasMessage ? field.messageId : undefined}
			aria-invalid={field?.invalid ? true : undefined}
			className="flex items-start gap-2 text-sm">
			<ArkCheckbox.Control className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border border-border bg-surface data-[state=checked]:border-primary data-[state=checked]:bg-primary">
				<ArkCheckbox.Indicator>
					<Check size={12} className="text-primary-foreground" />
				</ArkCheckbox.Indicator>
			</ArkCheckbox.Control>

			<ArkCheckbox.HiddenInput />

			<ArkCheckbox.Label className="text-muted-foreground">
				{children}
			</ArkCheckbox.Label>
		</ArkCheckbox.Root>
	);
}
