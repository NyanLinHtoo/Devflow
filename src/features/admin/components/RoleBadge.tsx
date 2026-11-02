import { roleLabels } from "@/lib/roles";
import type { AccountRole } from "@/types/authTypes";

const roleClasses: Record<AccountRole, string> = {
	ADMIN: "bg-primary/10 text-primary",
	MANAGER: "bg-surface-muted text-foreground",
	MEMBER: "bg-surface-muted text-muted-foreground",
};

export default function RoleBadge({ role }: { role: AccountRole }) {
	return (
		<span
			className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleClasses[role]}`}>
			{roleLabels[role]}
		</span>
	);
}
