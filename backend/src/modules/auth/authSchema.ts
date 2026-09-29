import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email({
    error: "Please enter a valid email address",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptedTerms: z.boolean().refine((value) => value === true, {
    error: "You must accept the Terms and Privacy Policy.",
  }),
});

export const loginSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resetPasswordSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address",
  }),
});

export const confirmPasswordResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
});
