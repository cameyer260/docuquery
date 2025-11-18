-- AlterTable
ALTER TABLE "Preview" ADD COLUMN     "expiry" TIMESTAMP(3),
ADD COLUMN     "presignedUrl" TEXT;
