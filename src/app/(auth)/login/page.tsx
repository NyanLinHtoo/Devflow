import LoginForm from "@/features/auth/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md">
				<div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900">
							Welcome back
						</h1>

						<p className="mt-2 text-sm text-gray-600">
							Sign in to continue to DevFlow.
						</p>
					</div>

					<LoginForm />

					<p className="mt-6 text-center text-sm text-gray-600">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-gray-900 hover:underline">
							Create account
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
