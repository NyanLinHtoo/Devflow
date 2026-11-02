import { Prisma } from "../generated/prisma/client.js";
import prisma from "./prisma.js";

const MAX_ATTEMPTS = 3;

export async function withSerializableRetry<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await prisma.$transaction(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const isRetryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034" &&
        attempt < MAX_ATTEMPTS;

      if (!isRetryable) {
        throw error;
      }
    }
  }
}
