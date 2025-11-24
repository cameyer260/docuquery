-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AGENT');

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Log_documentId_key" ON "Log"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_logId_key" ON "Message"("logId");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
