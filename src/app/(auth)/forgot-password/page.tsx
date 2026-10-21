import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
	return (
		<main
			id="main"
			className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
			<div className="w-full max-w-md">
				<div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							Forgot password
						</h1>

						<p className="mt-2 text-sm text-muted-foreground">
							Enter your email and we&apos;ll send a reset link.
						</p>
					</div>

					<ForgotPasswordForm />

					<p className="mt-6 text-center text-sm text-muted-foreground">
						<Link
							href="/login"
							className="font-medium text-foreground hover:underline">
							Back to sign in
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
