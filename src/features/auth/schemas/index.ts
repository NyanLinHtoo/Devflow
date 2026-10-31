import { z } from "zod";

export const forgotPasswordSchema = z.object({
	email: z.email({
		error: "Please enter a valid email address",
	}),
});

export const loginSchema = z.object({
	email: z.email({
		error: "Please enter a valid email address",
	}),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

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

export const resetPasswordSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z
			.string()
			.min(8, "Confirm password must be at least 8 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
