import prisma from "./prisma.js";

export async function pruneExpired() {
  const now = new Date();

  await Promise.all([
    prisma.session.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.emailVerification.deleteMany({ where: { expiresAt: { lt: now } } }),
  ]);
}
