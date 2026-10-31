import Link from "next/link";

export default function PrivacyPage() {
	return (
		<main id="main" className="mx-auto max-w-3xl px-6 py-12">
			<div className="space-y-8">
				<header className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Privacy Policy
					</h1>
					<p className="text-sm text-muted-foreground">
						Last updated: October 1, 2026
					</p>
				</header>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">
						1. Information We Collect
					</h2>
					<p className="leading-7 text-muted-foreground">
						When you create and use a DevFlow account, we may collect
						information such as your name, email address, account information,
						and the project or task information that you choose to provide.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">
						2. How We Use Your Information
					</h2>
					<p className="leading-7 text-muted-foreground">
						We use the information we collect to provide and maintain DevFlow,
						authenticate users, manage accounts, support project and task
						features, protect the service, and communicate with users when
						necessary.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">
						3. Authentication and Security
					</h2>
					<p className="leading-7 text-muted-foreground">
						DevFlow uses authentication mechanisms and security measures
						designed to protect user accounts and information. Passwords are not
						stored as plain text.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">
						4. Cookies and Sessions
					</h2>
					<p className="leading-7 text-muted-foreground">
						DevFlow may use cookies or similar technologies to maintain
						authenticated sessions and provide core functionality. These cookies
						may contain authentication-related information necessary for the
						service to operate.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">
						5. Information Sharing
					</h2>
					<p className="leading-7 text-muted-foreground">
						We do not share your personal information with third parties except
						where necessary to operate the service, comply with legal
						obligations, protect the service and its users, or when you
						otherwise authorize such sharing.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">
						6. Data Retention
					</h2>
					<p className="leading-7 text-muted-foreground">
						We retain information for as long as reasonably necessary to provide
						the service, maintain security, resolve disputes, and comply with
						applicable legal obligations.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">
						7. Your Rights
					</h2>
					<p className="leading-7 text-muted-foreground">
						Depending on your location and applicable law, you may have rights
						regarding your personal information, including rights to access,
						correct, or request deletion of certain information.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">
						8. Changes to This Privacy Policy
					</h2>
					<p className="leading-7 text-muted-foreground">
						We may update this Privacy Policy when our practices or legal
						requirements change. The latest version will always be published on
						this page with its updated date.
					</p>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
					<p className="leading-7 text-muted-foreground">
						If you have questions about this Privacy Policy or how your
						information is handled, please contact us at your designated support
						email address.
					</p>
				</section>

				<div className="border-t border-border pt-6">
					<Link
						href="/register"
						className="text-sm font-medium text-muted-foreground hover:text-foreground">
						← Back to registration
					</Link>
				</div>
			</div>
		</main>
	);
}
