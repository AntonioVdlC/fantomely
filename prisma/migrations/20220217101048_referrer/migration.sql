/*
  Warnings:

  - A unique constraint covering the columns `[websiteId,periodId,pathId,browserId,platformId,referrerId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Event_websiteId_periodId_pathId_browserId_platformId_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "referrerId" TEXT;

-- CreateTable
CREATE TABLE "Referrer" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referrer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referrer_value_websiteId_key" ON "Referrer"("value", "websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_websiteId_periodId_pathId_browserId_platformId_referr_key" ON "Event"("websiteId", "periodId", "pathId", "browserId", "platformId", "referrerId");

-- AddForeignKey
ALTER TABLE "Referrer" ADD CONSTRAINT "Referrer_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Referrer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
