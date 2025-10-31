/*
  Warnings:

  - Added the required column `processor` to the `Unsold` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ram` to the `Unsold` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageSize` to the `Unsold` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageType` to the `Unsold` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Unsold" ADD COLUMN     "processor" VARCHAR(255) NOT NULL,
ADD COLUMN     "ram" VARCHAR(255) NOT NULL,
ADD COLUMN     "storageSize" VARCHAR(255) NOT NULL,
ADD COLUMN     "storageType" VARCHAR(255) NOT NULL;
