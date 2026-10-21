-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MANAGER', 'MEMBER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'MEMBER';

-- Backfill: existing project managers become account managers
UPDATE "User"
SET "role" = 'MANAGER'
WHERE "id" IN (
  SELECT "userId" FROM "ProjectMember" WHERE "role" = 'MANAGER'
);
