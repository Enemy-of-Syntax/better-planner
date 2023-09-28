/*
  Warnings:

  - You are about to drop the column `createdUserId` on the `members` table. All the data in the column will be lost.
  - Added the required column `created_user_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_createdUserId_fkey";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "createdUserId";
ALTER TABLE "members" ADD COLUMN     "created_user_id" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
