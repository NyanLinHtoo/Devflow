import { Lockup } from "@/components/brand/lockup";
import Link from "next/link";

export default function HomePage() {
	return (
		<main
			id="main"
			className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
			<div className="w-full max-w-md space-y-8 text-center">
				<div>
					<h1 className="sr-only">DevFlow</h1>

					<div className="flex justify-center">
						<Lockup className="h-12 w-auto" priority />
					</div>

					<p className="mt-3 text-sm text-muted-foreground">
						Project management for modern software teams. Plan projects, assign
						tasks, and track progress in one place.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<Link
						href="/register"
						className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
						Get started
					</Link>

					<Link
						href="/login"
						className="inline-flex h-11 items-center justify-center rounded-md bg-surface-muted px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted/70">
						Sign in
					</Link>
				</div>
			</div>
		</main>
	);
}
