/*
  Warnings:

  - You are about to drop the column `previewId` on the `Document` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Document_previewId_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "previewId";
