import { z } from "zod";

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be at most 100 characters")
      .optional(),

    timezone: z
      .string()
      .max(64, "Timezone must be at most 64 characters")
      .optional()
      .nullable(),

    bio: z
      .string()
      .max(160, "Bio must be at most 160 characters")
      .optional()
      .nullable(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Enter your password"),
});
