export type ProjectMember = {
	id: string;
	userId: string;
	fullName: string;
	email: string;
	role: "MEMBER" | "MANAGER";
};
