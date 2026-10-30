import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
};

export function Button({
	variant = "primary",
	size = "md",
	className = "",
	...props
}: ButtonProps) {
	const baseStyles =
		"inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors pointer-coarse:min-h-11 disabled:pointer-events-none disabled:opacity-50";

	const variantStyles = {
		primary: "bg-primary text-primary-foreground hover:bg-primary/90",
		secondary: "bg-surface-muted text-foreground hover:bg-surface-muted/70",
		ghost: "bg-transparent text-foreground hover:bg-surface-muted",
		danger: "bg-danger text-white hover:bg-danger/90",
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
