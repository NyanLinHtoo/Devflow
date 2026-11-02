-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('ROLE_CHANGED');

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "targetUserId" UUID NOT NULL,
    "action" "AdminAction" NOT NULL,
    "fromRole" "UserRole",
    "toRole" "UserRole",
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetUserId_idx" ON "AdminAuditLog"("targetUserId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");
