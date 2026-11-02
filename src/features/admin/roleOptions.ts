import type { AccountRole } from "@/types/authTypes";

export const accountRoleOptions: { value: AccountRole; label: string }[] = [
	{ value: "MEMBER", label: "Member" },
	{ value: "MANAGER", label: "Manager" },
	{ value: "ADMIN", label: "Admin" },
];

export const accountRoleFilterOptions: {
	value: AccountRole | "ALL";
	label: string;
}[] = [{ value: "ALL", label: "All roles" }, ...accountRoleOptions];
