import { z } from "zod";

export const registerSchema = z
	.object({
		fullName: z.string().min(2, "Full name must be at least 2 characters"),
		email: z.email({
			error: "Please enter a valid email address",
		}),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(8, "Confirm password must be at least 8 characters"),
		acceptedTerms: z.boolean().refine((value) => value === true, {
			error: "You must accept the Terms and Privacy Policy.",
		}),
	})
	.refine((user) => user.password === user.confirmPassword, {
		error: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;
