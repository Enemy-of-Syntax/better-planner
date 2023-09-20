/*
  Warnings:

  - You are about to drop the column `createdAt` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `project_on_organizations` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `project_on_organizations` table. All the data in the column will be lost.
  - You are about to drop the column `boardId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `project_on_organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `project_on_organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `board_id` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_on_organizations" DROP CONSTRAINT "project_on_organizations_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "project_on_organizations" DROP CONSTRAINT "project_on_organizations_projectId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_boardId_fkey";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "createdAt";
ALTER TABLE "files" DROP COLUMN "updatedAt";
ALTER TABLE "files" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "files" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "project_on_organizations" DROP COLUMN "organizationId";
ALTER TABLE "project_on_organizations" DROP COLUMN "projectId";
ALTER TABLE "project_on_organizations" ADD COLUMN     "organization_id" STRING NOT NULL;
ALTER TABLE "project_on_organizations" ADD COLUMN     "project_id" STRING NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "boardId";
ALTER TABLE "tasks" DROP COLUMN "updatedAt";
ALTER TABLE "tasks" ADD COLUMN     "board_id" STRING NOT NULL;
ALTER TABLE "tasks" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "project_on_organizations" ADD CONSTRAINT "project_on_organizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_on_organizations" ADD CONSTRAINT "project_on_organizations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
