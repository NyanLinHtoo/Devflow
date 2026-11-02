import type { AccountRole } from "@/types/authTypes";

export const roleLabels: Record<AccountRole, string> = {
	ADMIN: "Admin",
	MANAGER: "Manager",
	MEMBER: "Member",
};

export function canCreateProjects(role: AccountRole) {
	return role === "MANAGER" || role === "ADMIN";
}

export function isAdmin(role: AccountRole) {
	return role === "ADMIN";
}
