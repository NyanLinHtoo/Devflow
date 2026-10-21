import { AppShell } from "@/components/app-shell/appShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <AppShell>{children}</AppShell>;
}
