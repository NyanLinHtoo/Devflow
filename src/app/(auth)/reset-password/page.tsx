import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md">
				<div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900">
							Reset password
						</h1>

						<p className="mt-2 text-sm text-gray-600">
							Choose a new password for your account.
						</p>
					</div>

					<Suspense
						fallback={
							<p className="text-center text-sm text-gray-600">Loading...</p>
						}>
						<ResetPasswordForm />
					</Suspense>
				</div>
			</div>
		</main>
	);
}
