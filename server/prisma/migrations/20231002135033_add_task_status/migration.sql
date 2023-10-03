-- CreateEnum
CREATE TYPE "TASK_STATUS" AS ENUM ('EXPIRED', 'ACTIVE');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "status" "TASK_STATUS" NOT NULL DEFAULT 'ACTIVE';
