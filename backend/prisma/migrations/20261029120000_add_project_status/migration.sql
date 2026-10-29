-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
ADD COLUMN "dueDate" TIMESTAMP(3);
