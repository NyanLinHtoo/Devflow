import LegalShell, {
	type LegalSection,
} from "@/features/legal/components/LegalShell";

const sections: LegalSection[] = [
	{
		id: "acceptance-of-terms",
		title: "Acceptance of Terms",
		paragraphs: [
			"By creating an account or using DevFlow, you agree to these Terms of Use. If you do not agree with these terms, you should not use DevFlow.",
		],
	},
	{
		id: "your-account",
		title: "Your Account",
		paragraphs: [
			"You are responsible for providing accurate information when creating your account and for keeping your account credentials secure. You are responsible for activity that occurs through your account.",
		],
	},
	{
		id: "acceptable-use",
		title: "Acceptable Use",
		paragraphs: [
			"You agree to use DevFlow only for lawful purposes and in a way that does not interfere with the service or negatively affect other users.",
		],
		note: "You must not use DevFlow to attempt unauthorized access, distribute malicious software, abuse the service, or violate applicable laws or regulations.",
	},
	{
		id: "your-content",
		title: "Your Content",
		paragraphs: [
			"You retain responsibility for the content and information that you submit to DevFlow. You should only submit content that you have the right to use and share.",
		],
	},
	{
		id: "service-availability",
		title: "Service Availability",
		paragraphs: [
			"DevFlow is provided on an availability basis, and we may modify, update, suspend, or discontinue parts of the service when necessary.",
		],
	},
	{
		id: "account-suspension-or-termination",
		title: "Account Suspension or Termination",
		paragraphs: [
			"We may suspend or terminate an account if it is used in violation of these terms, applicable laws, or in a way that could harm the service or other users.",
		],
	},
	{
		id: "changes-to-these-terms",
		title: "Changes to These Terms",
		paragraphs: [
			"We may update these Terms of Use from time to time. When changes are made, the updated version will be published on this page with a new update date.",
		],
	},
];

export default function TermsPage() {
	return (
		<LegalShell
			title="Terms of Use"
			updated="Oct 1, 2026"
			current="terms"
			otherHref="/privacy"
			otherLabel="Privacy Policy"
			sections={sections}
		/>
	);
}
