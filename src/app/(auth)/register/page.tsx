import { RegisterForm } from "@/features/auth/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md">
				<div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
					<div className="mb-8 text-center">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900">
							Create your account
						</h1>

						<p className="mt-2 text-sm text-gray-600">
							Start managing your projects with DevFlow.
						</p>
					</div>

					<RegisterForm />

					<p className="mt-6 text-center text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-gray-900 hover:underline">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
