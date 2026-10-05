import { z } from "zod";

const normalizedEmail = z
  .email({
    error: "Please enter a valid email address",
  })
  .transform((value) => value.trim().toLowerCase());

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: normalizedEmail,
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptedTerms: z.boolean().refine((value) => value === true, {
    error: "You must accept the Terms and Privacy Policy.",
  }),
});

export const loginSchema = z.object({
  email: normalizedEmail,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resetPasswordSchema = z.object({
  email: normalizedEmail,
});

export const confirmPasswordResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationSchema = z.object({
  email: normalizedEmail,
});
