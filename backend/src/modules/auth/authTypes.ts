import { z } from "zod";
import { loginSchema, registerSchema } from "./authSchema.js";

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type RefreshTokenPayload = {
  userId: string;
  sessionId: string;
};
