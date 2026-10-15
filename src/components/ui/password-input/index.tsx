import { Eye, EyeOff } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { useState } from "react";

type PasswordInputProps = Omit<ComponentPropsWithRef<"input">, "type">;

export function PasswordInput({
	className = "",
	ref,
	disabled,
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="relative">
			<input
				className={[
					"h-10 w-full rounded-md border border-border bg-surface pr-11 pl-3 text-base text-foreground",
					"transition-colors sm:text-sm",
					"placeholder:text-muted-foreground",
					"pointer-coarse:min-h-11",
					"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
					className,
				].join(" ")}
				type={showPassword ? "text" : "password"}
				ref={ref}
				{...props}
			/>
			<button
				disabled={disabled}
				type="button"
				onClick={() => setShowPassword((prev) => !prev)}
				aria-label={showPassword ? "Hide password" : "Show password"}
				className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60">
				{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
			</button>
		</div>
	);
}
