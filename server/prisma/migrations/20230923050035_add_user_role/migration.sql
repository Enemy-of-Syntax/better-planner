-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('ADMIN', 'MEMBER', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "USER_ROLE";
