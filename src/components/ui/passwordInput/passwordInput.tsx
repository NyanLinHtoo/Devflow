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
					"h-10 w-full rounded-md border border-gray-300 text-black bg-white pr-10 pl-3 text-sm",
					"outline-none transition-colors",
					"placeholder:text-gray-400",
					"focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10",
					"disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60",
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
				className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60">
				{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
			</button>
		</div>
	);
}
