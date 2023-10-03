/*
  Warnings:

  - You are about to drop the `_fileTotask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_fileTotask" DROP CONSTRAINT "_fileTotask_A_fkey";

-- DropForeignKey
ALTER TABLE "_fileTotask" DROP CONSTRAINT "_fileTotask_B_fkey";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "task_id" STRING;

-- DropTable
DROP TABLE "_fileTotask";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
