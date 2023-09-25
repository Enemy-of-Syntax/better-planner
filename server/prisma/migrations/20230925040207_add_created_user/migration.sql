/*
  Warnings:

  - Added the required column `createdUserId` to the `boards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdUserId` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdUserId` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdUserId` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdUserId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "createdUserId" STRING NOT NULL;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "createdUserId" STRING NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "createdUserId" STRING NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "createdUserId" STRING NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "createdUserId" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
