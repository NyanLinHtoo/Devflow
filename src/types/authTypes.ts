export type AccountRole = "ADMIN" | "MANAGER" | "MEMBER";

export type CurrentUser = {
	id: string;
	fullName: string;
	email: string;
	role: AccountRole;
	timezone: string | null;
	bio: string | null;
	createdAt: string;
};
