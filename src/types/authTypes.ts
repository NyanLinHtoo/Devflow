export type AccountRole = "MANAGER" | "MEMBER";

export type CurrentUser = {
	id: string;
	fullName: string;
	email: string;
	role: AccountRole;
	createdAt: string;
};
