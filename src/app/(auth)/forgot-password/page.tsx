import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md">
				<div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900">
							Forgot password
						</h1>

						<p className="mt-2 text-sm text-gray-600">
							Enter your email and we&apos;ll send a reset link.
						</p>
					</div>

					<ForgotPasswordForm />

					<p className="mt-6 text-center text-sm text-gray-600">
						<Link
							href="/login"
							className="font-medium text-gray-900 hover:underline">
							Back to sign in
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
