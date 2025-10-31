/*
  Warnings:

  - You are about to drop the column `type` on the `Unsold` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Unsold" DROP COLUMN "type";

-- CreateTable
CREATE TABLE "Sold" (
    "id" TEXT NOT NULL,
    "buyerName" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "computerModel" VARCHAR(255) NOT NULL,
    "salesPrice" INTEGER NOT NULL,
    "specifications" VARCHAR(255) NOT NULL,
    "warranty" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sold_pkey" PRIMARY KEY ("id")
);
