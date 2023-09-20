/*
  Warnings:

  - You are about to drop the column `organization_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organization_id_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "organization_id";

-- CreateTable
CREATE TABLE "project_on_organizations" (
    "id" STRING NOT NULL,
    "organizationId" STRING NOT NULL,
    "projectId" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_on_organizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_on_organizations" ADD CONSTRAINT "project_on_organizations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_on_organizations" ADD CONSTRAINT "project_on_organizations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
