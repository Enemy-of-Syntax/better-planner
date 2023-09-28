/*
  Warnings:

  - You are about to drop the column `Recovery_code` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "Recovery_code";
ALTER TABLE "users" ADD COLUMN     "recovery_code" STRING;
