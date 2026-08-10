import { Button } from "@/components/ui/button";

export default function HomePage() {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<div className="space-y-6 text-center">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">DevFlow</h1>

					<p className="mt-3 text-gray-600">
						Project management for modern software teams.
					</p>
				</div>

				<div className="flex justify-center gap-3">
					<Button>Get Started</Button>

					<Button variant="secondary">Learn More</Button>

					<Button variant="ghost">Sign In</Button>
				</div>
			</div>
		</main>
	);
}
