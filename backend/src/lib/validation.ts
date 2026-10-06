import { z } from "zod";

export type ValidationError = Error & {
  isValidationError: true;
  zodError: z.ZodError;
};

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof Error && "isValidationError" in error;
}

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const r = schema.safeParse(data);

  if (!r.success) {
    throw Object.assign(new Error("Invalid request"), {
      isValidationError: true as const,
      zodError: r.error,
    });
  }

  return r.data;
}
