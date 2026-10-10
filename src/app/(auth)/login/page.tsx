import LoginForm from "@/features/auth/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
			<div className="w-full max-w-md">
				<div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							Welcome back
						</h1>

						<p className="mt-2 text-sm text-muted-foreground">
							Sign in to continue to DevFlow.
						</p>
					</div>

					<LoginForm />

					<p className="mt-6 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-foreground hover:underline">
							Create account
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
