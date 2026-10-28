"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useLogout } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { roleLabels } from "@/lib/roles";
import { FolderKanban, LayoutDashboard, LogOut } from "lucide-react";
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
	const { theme, setTheme } = useTheme();
	const logoutMutation = useLogout();

	function handleLogout() {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				router.replace("/login");
			},
		});
	}

	return (
		<div className="flex min-h-screen w-full flex-col lg:flex-row">
			<aside className="flex flex-col gap-4 border-b border-border bg-surface px-4 py-4 lg:w-64 lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
				<div className="flex items-center justify-between gap-3">
					<Link
						href="/dashboard"
						className="text-lg font-semibold tracking-tight">
						DevFlow
					</Link>

					<Button
						variant="ghost"
						size="sm"
						className="lg:hidden"
						onClick={handleLogout}
						disabled={logoutMutation.isPending}>
						<LogOut size={16} aria-hidden="true" />
						{logoutMutation.isPending ? "Signing out..." : "Sign out"}
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

				<div className="px-1">
					<Switch
						id="theme-toggle"
						label="Dark mode"
						checked={theme === "dark"}
						onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
					/>
				</div>

				<div className="hidden lg:mt-auto lg:block">
					{user ? (
						<div className="mb-3 min-w-0">
							<p className="truncate text-sm font-medium">{user.fullName}</p>
							<p className="truncate text-xs text-muted-foreground">
								{user.email}
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{roleLabels[user.role]}
							</p>
						</div>
					) : null}

					<Button
						variant="secondary"
						className="w-full"
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
