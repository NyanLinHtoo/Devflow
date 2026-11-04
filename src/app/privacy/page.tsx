import LegalShell, {
	type LegalSection,
} from "@/features/legal/components/LegalShell";

const sections: LegalSection[] = [
	{
		id: "information-we-collect",
		title: "Information We Collect",
		paragraphs: [
			"When you create and use a DevFlow account, we may collect information such as your name, email address, account information, and the project or task information that you choose to provide.",
		],
	},
	{
		id: "how-we-use-your-information",
		title: "How We Use Your Information",
		paragraphs: [
			"We use the information we collect to provide and maintain DevFlow, authenticate users, manage accounts, support project and task features, protect the service, and communicate with users when necessary.",
		],
	},
	{
		id: "authentication-and-security",
		title: "Authentication and Security",
		paragraphs: [
			"DevFlow uses authentication mechanisms and security measures designed to protect user accounts and information. Passwords are not stored as plain text.",
		],
	},
	{
		id: "cookies-and-sessions",
		title: "Cookies and Sessions",
		paragraphs: [
			"DevFlow may use cookies or similar technologies to maintain authenticated sessions and provide core functionality. These cookies may contain authentication-related information necessary for the service to operate.",
		],
	},
	{
		id: "information-sharing",
		title: "Information Sharing",
		paragraphs: [
			"We do not share your personal information with third parties except where necessary to operate the service, comply with legal obligations, protect the service and its users, or when you otherwise authorize such sharing.",
		],
	},
	{
		id: "data-retention",
		title: "Data Retention",
		paragraphs: [
			"We retain information for as long as reasonably necessary to provide the service, maintain security, resolve disputes, and comply with applicable legal obligations.",
		],
	},
	{
		id: "your-rights",
		title: "Your Rights",
		paragraphs: [
			"Depending on your location and applicable law, you may have rights regarding your personal information, including rights to access, correct, or request deletion of certain information.",
		],
	},
	{
		id: "changes-to-this-privacy-policy",
		title: "Changes to This Privacy Policy",
		paragraphs: [
			"We may update this Privacy Policy when our practices or legal requirements change. The latest version will always be published on this page with its updated date.",
		],
	},
];

export default function PrivacyPage() {
	return (
		<LegalShell
			title="Privacy Policy"
			updated="Oct 1, 2026"
			current="privacy"
			otherHref="/terms"
			otherLabel="Terms of Use"
			sections={sections}
		/>
	);
}
