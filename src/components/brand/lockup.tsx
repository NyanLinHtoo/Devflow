"use client";

import { useTheme } from "@/components/theme-provider";
import Image from "next/image";

type LockupProps = {
	className?: string;
	priority?: boolean;
};

export function Lockup({ className = "", priority = false }: LockupProps) {
	const { theme } = useTheme();

	return (
		<Image
			src={
				theme === "dark" ? "/logo-lockup-dark.svg" : "/logo-lockup-light.svg"
			}
			alt="DevFlow"
			width={240}
			height={64}
			unoptimized
			priority={priority}
			className={className}
		/>
	);
}
