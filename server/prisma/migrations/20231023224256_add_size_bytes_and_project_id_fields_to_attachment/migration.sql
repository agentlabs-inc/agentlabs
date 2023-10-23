/*
  Warnings:

  - Added the required column `projectId` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeBytes` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "sizeBytes" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
