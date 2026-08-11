import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export default function HomePage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-sm space-y-6 rounded-xl border bg-white p-6 shadow-sm">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">DevFlow</h1>

					<p className="mt-2 text-sm text-gray-600">
						Project management for modern software teams.
					</p>
				</div>

				<div className="space-y-4">
					<FormField
						label="Email"
						htmlFor="email"
						helperText="Use your work email address.">
						<Input id="email" type="email" placeholder="you@example.com" />
					</FormField>

					<FormField
						label="Password"
						htmlFor="password"
						error="Password must be at least 8 characters.">
						<Input
							id="password"
							type="password"
							placeholder="Enter your password"
							aria-invalid="true"
						/>
					</FormField>

					<Button className="w-full">Get Started</Button>
				</div>
			</div>
		</main>
	);
}
