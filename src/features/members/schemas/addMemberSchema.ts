import { z } from "zod";

export const addMemberSchema = z.object({
	email: z.email({
		error: "Please enter a valid email address",
	}),
	role: z.enum(["MANAGER", "MEMBER"]),
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;
