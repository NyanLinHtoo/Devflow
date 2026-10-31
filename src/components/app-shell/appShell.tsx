"use client";

import { Lockup } from "@/components/brand/lockup";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getInitials } from "@/lib/initials";
import { roleLabels } from "@/lib/roles";
import {
	ChevronRight,
	FolderKanban,
	LayoutDashboard,
	LogOut,
	Moon,
	Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/projects", label: "Projects", icon: FolderKanban },
];

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: user } = useCurrentUser();
	const { theme, toggleTheme } = useTheme();
	const logoutMutation = useLogout();

	function handleLogout() {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				router.replace("/login");
			},
		});
	}

	const isProfileActive = pathname.startsWith("/profile");

	return (
		<div className="flex min-h-screen w-full flex-col lg:flex-row">
			<aside className="flex flex-col gap-4 border-b border-border bg-surface px-4 py-4 lg:w-64 lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
				<div className="flex items-center justify-between gap-3">
					<Link href="/dashboard">
						<Lockup className="h-6 w-auto" priority />
					</Link>

					<Button
						variant="ghost"
						size="sm"
						className="px-0"
						onClick={() => toggleTheme()}
						aria-label={
							theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
						}
						title={
							theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
						}>
						{theme === "dark" ? (
							<Sun size={16} aria-hidden="true" />
						) : (
							<Moon size={16} aria-hidden="true" />
						)}
					</Button>
				</div>

				<nav
					aria-label="Main"
					className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`);

						return (
							<Link
								key={item.href}
								href={item.href}
								aria-current={isActive ? "page" : undefined}
								className={[
									"inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
								].join(" ")}>
								<Icon size={16} aria-hidden="true" />
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="lg:mt-auto">
					{user ? (
						<Link
							href="/profile"
							aria-current={isProfileActive ? "page" : undefined}
							className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-2 transition-colors hover:bg-surface">
							<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
								{getInitials(user.fullName)}
							</span>

							<span className="min-w-0 flex-1">
								<span className="block truncate text-sm font-medium">
									{user.fullName}
								</span>
								<span className="block truncate text-xs text-muted-foreground">
									{user.email}
								</span>
								<span className="block text-xs text-muted-foreground">
									{roleLabels[user.role]}
								</span>
							</span>

							<ChevronRight
								size={16}
								aria-hidden="true"
								className="shrink-0 text-muted-foreground"
							/>
						</Link>
					) : null}

					<Button
						variant="secondary"
						className="mt-2 w-full"
						onClick={handleLogout}
						disabled={logoutMutation.isPending}>
						<LogOut size={16} aria-hidden="true" />
						{logoutMutation.isPending ? "Signing out..." : "Sign out"}
					</Button>
				</div>
			</aside>

			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}
