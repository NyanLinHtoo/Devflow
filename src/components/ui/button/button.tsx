import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md" | "lg";
};

export function Button({
	variant = "primary",
	size = "md",
	className = "",
	...props
}: ButtonProps) {
	const baseStyles =
		"inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

	const variantStyles = {
		primary: "bg-black text-white hover:bg-black/85",
		secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
		ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
	};

	const sizeStyles = {
		sm: "h-8 px-3 text-sm",
		md: "h-10 px-4 text-sm",
		lg: "h-12 px-6 text-base",
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			{...props}
		/>
	);
}
