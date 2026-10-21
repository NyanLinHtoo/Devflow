import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
	return (
		<main
			id="main"
			className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
			<div className="w-full max-w-md">
				<div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground">
							Reset password
						</h1>

						<p className="mt-2 text-sm text-muted-foreground">
							Choose a new password for your account.
						</p>
					</div>

					<Suspense
						fallback={
							<p className="text-center text-sm text-muted-foreground">
								Loading...
							</p>
						}>
						<ResetPasswordForm />
					</Suspense>
				</div>
			</div>
		</main>
	);
}
