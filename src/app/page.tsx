import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md space-y-8 text-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">DevFlow</h1>

					<p className="mt-2 text-sm text-gray-600">
						Project management for modern software teams. Plan projects, assign
						tasks, and track progress in one place.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<Link
						href="/register"
						className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-black/85">
						Get started
					</Link>

					<Link
						href="/login"
						className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200">
						Sign in
					</Link>
				</div>
			</div>
		</main>
	);
}
