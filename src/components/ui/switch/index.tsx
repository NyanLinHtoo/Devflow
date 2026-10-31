"use client";

import { Switch as ArkSwitch } from "@ark-ui/react/switch";

type SwitchProps = {
	id?: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	label: string;
	disabled?: boolean;
};

export function Switch({
	id,
	checked,
	onCheckedChange,
	label,
	disabled,
}: SwitchProps) {
	return (
		<ArkSwitch.Root
			id={id}
			checked={checked}
			onCheckedChange={(details) => onCheckedChange(details.checked)}
			disabled={disabled}
			className="flex items-center justify-between gap-3">
			<ArkSwitch.Label className="text-sm text-muted-foreground">
				{label}
			</ArkSwitch.Label>

			<ArkSwitch.Control className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-surface-muted transition-colors data-[state=checked]:bg-primary">
				<ArkSwitch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-surface shadow transition-transform data-[state=checked]:translate-x-5.5" />
			</ArkSwitch.Control>

			<ArkSwitch.HiddenInput />
		</ArkSwitch.Root>
	);
}
