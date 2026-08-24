import { z } from "zod";
import { loginSchema, registerSchema } from "./auth.schema.js";

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type RefreshTokenPayload = {
  userId: string;
  sessionId: string;
};
