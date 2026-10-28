"use client";

import { PasswordInput as ArkPasswordInput } from "@ark-ui/react/password-input";
import { Eye, EyeOff } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { useFormFieldContext } from "../form-field/context";

type PasswordInputProps = Omit<ComponentPropsWithRef<"input">, "type">;

export function PasswordInput({
	className = "",
	ref,
	disabled,
	...props
}: PasswordInputProps) {
	const field = useFormFieldContext();

	return (
		<ArkPasswordInput.Root>
			<ArkPasswordInput.Control className="relative">
				<ArkPasswordInput.Input
					{...props}
					ref={ref}
					disabled={disabled}
					aria-describedby={
						field?.hasMessage ? field.messageId : props["aria-describedby"]
					}
					aria-invalid={field?.invalid ? true : props["aria-invalid"]}
					className={[
						"h-10 w-full rounded-md border border-border bg-surface pr-11 pl-3 text-base text-foreground",
						"transition-colors sm:text-sm",
						"placeholder:text-muted-foreground",
						"pointer-coarse:min-h-11",
						"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
						className,
					].join(" ")}
				/>

				<ArkPasswordInput.VisibilityTrigger className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60">
					<ArkPasswordInput.Indicator fallback={<Eye size={18} />}>
						<EyeOff size={18} />
					</ArkPasswordInput.Indicator>
				</ArkPasswordInput.VisibilityTrigger>
			</ArkPasswordInput.Control>
		</ArkPasswordInput.Root>
	);
}
