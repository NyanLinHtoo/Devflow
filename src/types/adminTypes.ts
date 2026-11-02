import type { AccountRole } from "./authTypes";

export type AdminUser = {
	id: string;
	fullName: string;
	email: string;
	role: AccountRole;
	emailVerifiedAt: string | null;
	createdAt: string;
	projectCount: number;
};

export type AdminUsersResponse = {
	users: AdminUser[];
	total: number;
	page: number;
	pageSize: number;
};
