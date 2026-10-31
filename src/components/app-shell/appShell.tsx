"use client";

import { Lockup } from "@/components/brand/lockup";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getInitials } from "@/lib/initials";
import { roleLabels } from "@/lib/roles";
import type { CurrentUser } from "@/types/authTypes";
import {
	ChevronRight,
	FolderKanban,
	LayoutDashboard,
	LogOut,
	Menu,
	Moon,
	Sun,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/projects", label: "Projects", icon: FolderKanban },
];

type Theme = "light" | "dark";

function ThemeButton({
	theme,
	onToggle,
	className = "",
}: {
	theme: Theme;
	onToggle: () => void;
	className?: string;
}) {
	const label =
		theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

	return (
		<Button
			variant="ghost"
			size="sm"
			className={`px-0 ${className}`}
			onClick={onToggle}
			aria-label={label}
			title={label}>
			{theme === "dark" ? (
				<Sun size={16} aria-hidden="true" />
			) : (
				<Moon size={16} aria-hidden="true" />
			)}
		</Button>
	);
}

function AccountCard({
	user,
	active,
	onNavigate,
}: {
	user: CurrentUser;
	active: boolean;
	onNavigate?: () => void;
}) {
	return (
		<Link
			href="/profile"
			onClick={onNavigate}
			aria-current={active ? "page" : undefined}
			className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-2 transition-colors hover:bg-surface">
			<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
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
	);
}

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: user } = useCurrentUser();
	const { theme, toggleTheme } = useTheme();
	const logoutMutation = useLogout();
	const [isMenuOpen, setMenuOpen] = useState(false);
	const drawerRef = useRef<HTMLDivElement>(null);

	const isProfileActive = pathname.startsWith("/profile");

	function closeMenu() {
		setMenuOpen(false);
		document.getElementById("mobile-menu-button")?.focus();
	}

	function handleLogout() {
		setMenuOpen(false);
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				router.replace("/login");
			},
		});
	}

	useEffect(() => {
		if (!isMenuOpen) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		drawerRef.current?.focus();

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setMenuOpen(false);
				document.getElementById("mobile-menu-button")?.focus();
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isMenuOpen]);

	useEffect(() => {
		const media = window.matchMedia("(min-width: 768px)");

		function handleChange() {
			if (media.matches) {
				setMenuOpen(false);
			}
		}

		media.addEventListener("change", handleChange);

		return () => media.removeEventListener("change", handleChange);
	}, []);

	return (
		<div className="min-h-screen w-full">
			{/* Desktop sidebar */}
			<aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-4 overflow-y-auto border-r border-border bg-surface px-4 py-6 lg:flex">
				<div className="flex items-center justify-between gap-3">
					<Link href="/dashboard">
						<Lockup className="h-6 w-auto" priority />
					</Link>

					<ThemeButton theme={theme} onToggle={() => toggleTheme()} />
				</div>

				<nav aria-label="Main" className="flex flex-col gap-1">
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
					{user ? <AccountCard user={user} active={isProfileActive} /> : null}

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

			{/* Tablet icon rail */}
			<aside className="fixed inset-y-0 left-0 z-30 hidden w-18 flex-col items-center gap-2 overflow-y-auto border-r border-border bg-surface py-6 md:flex lg:hidden">
				<Link href="/dashboard" aria-label="DevFlow dashboard" className="mb-2">
					<Image
						src="/logo-mark.svg"
						alt=""
						width={24}
						height={24}
						unoptimized
						className="size-6"
					/>
				</Link>

				<nav
					aria-label="Main"
					className="flex w-full flex-col items-center gap-1">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`);

						return (
							<Link
								key={item.href}
								href={item.href}
								aria-current={isActive ? "page" : undefined}
								aria-label={item.label}
								title={item.label}
								className={[
									"flex size-10 items-center justify-center rounded-lg transition-colors",
									isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
								].join(" ")}>
								<Icon size={18} aria-hidden="true" />
							</Link>
						);
					})}
				</nav>

				<div className="mt-auto flex flex-col items-center gap-2">
					<ThemeButton
						theme={theme}
						onToggle={() => toggleTheme()}
						className="size-9"
					/>

					{user ? (
						<Link
							href="/profile"
							aria-current={isProfileActive ? "page" : undefined}
							aria-label="Your profile"
							title="Your profile"
							className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
							{getInitials(user.fullName)}
						</Link>
					) : null}
				</div>
			</aside>

			{/* Mobile top bar */}
			<div className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4 md:hidden">
				<Link href="/dashboard">
					<Lockup className="h-6 w-auto" priority />
				</Link>

				<div className="flex items-center gap-1">
					<ThemeButton theme={theme} onToggle={() => toggleTheme()} />

					<Button
						id="mobile-menu-button"
						variant="ghost"
						size="sm"
						className="px-0"
						onClick={() => setMenuOpen(true)}
						aria-label="Open menu"
						aria-expanded={isMenuOpen}
						aria-controls="mobile-menu">
						<Menu size={18} aria-hidden="true" />
					</Button>
				</div>
			</div>

			<div className="min-w-0 md:pl-18 lg:pl-64">{children}</div>

			{/* Mobile drawer */}
			{isMenuOpen ? (
				<div
					className="fixed inset-0 z-50 md:hidden"
					role="dialog"
					aria-modal="true"
					aria-label="Navigation">
					<div
						className="absolute inset-0 bg-black/30"
						onClick={closeMenu}
						aria-hidden="true"
					/>

					<div
						ref={drawerRef}
						tabIndex={-1}
						className="absolute inset-y-0 left-0 flex w-72 max-w-[82vw] flex-col gap-4 border-r border-border bg-surface p-4 shadow-xl outline-none">
						<div className="flex items-center justify-between gap-3">
							<Link href="/dashboard" onClick={closeMenu}>
								<Lockup className="h-6 w-auto" priority />
							</Link>

							<Button
								variant="ghost"
								size="sm"
								className="px-0"
								onClick={closeMenu}
								aria-label="Close menu">
								<X size={18} aria-hidden="true" />
							</Button>
						</div>

						<nav
							id="mobile-menu"
							aria-label="Main"
							className="flex flex-col gap-1">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive =
									pathname === item.href ||
									pathname.startsWith(`${item.href}/`);

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={closeMenu}
										aria-current={isActive ? "page" : undefined}
										className={[
											"flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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

						<div className="mt-auto">
							{user ? (
								<AccountCard
									user={user}
									active={isProfileActive}
									onNavigate={closeMenu}
								/>
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
					</div>
				</div>
			) : null}
		</div>
	);
}
