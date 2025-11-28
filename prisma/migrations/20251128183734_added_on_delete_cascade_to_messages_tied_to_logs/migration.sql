-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_logId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE CASCADE ON UPDATE CASCADE;
