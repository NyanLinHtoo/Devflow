import Link from "next/link";

export default function TermsPage() {
	return (
		<main className="bg- mx-auto max-w-3xl px-6 py-12">
			<div className="space-y-8">
				<header className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Terms of Use
					</h1>
					<p className="text-sm text-gray-500">Last updated: October 1, 2026</p>
				</header>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-gray-900">
						1. Acceptance of Terms
					</h2>
					<p className="leading-7 text-gray-600">
						By creating an account or using DevFlow, you agree to these Terms of
						Use. If you do not agree with these terms, you should not use
						DevFlow.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-gray-900">
						2. Your Account
					</h2>
					<p className="leading-7 text-gray-600">
						You are responsible for providing accurate information when creating
						your account and for keeping your account credentials secure. You
						are responsible for activity that occurs through your account.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-gray-900">
						3. Acceptable Use
					</h2>
					<p className="leading-7 text-gray-600">
						You agree to use DevFlow only for lawful purposes and in a way that
						does not interfere with the service or negatively affect other
						users.
					</p>
					<p className="leading-7 text-gray-600">
						You must not use DevFlow to attempt unauthorized access, distribute
						malicious software, abuse the service, or violate applicable laws or
						regulations.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-gray-900">
						4. Your Content
					</h2>
					<p className="leading-7 text-gray-600">
						You retain responsibility for the content and information that you
						submit to DevFlow. You should only submit content that you have the
						right to use and share.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-gray-900">
						5. Service Availability
					</h2>
					<p className="leading-7 text-gray-600">
						DevFlow is provided on an availability basis, and we may modify,
						update, suspend, or discontinue parts of the service when necessary.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-gray-900">
						6. Account Suspension or Termination
					</h2>
					<p className="leading-7 text-gray-600">
						We may suspend or terminate an account if it is used in violation of
						these terms, applicable laws, or in a way that could harm the
						service or other users.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-gray-900">
						7. Changes to These Terms
					</h2>
					<p className="leading-7 text-gray-600">
						We may update these Terms of Use from time to time. When changes are
						made, the updated version will be published on this page with a new
						update date.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-gray-900">8. Contact</h2>
					<p className="leading-7 text-gray-600">
						If you have questions about these Terms of Use, please contact us at
						your designated support email address.
					</p>
				</section>

				<div className="border-t border-gray-200 pt-6">
					<Link
						href="/register"
						className="text-sm font-medium text-gray-700 hover:text-gray-900 ">
						← Back to registration
					</Link>
				</div>
			</div>
		</main>
	);
}
