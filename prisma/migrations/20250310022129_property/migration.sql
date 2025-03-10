/*
  Warnings:

  - Made the column `public_price` on table `properties` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area` on table `properties` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `properties` MODIFY `public_price` VARCHAR(255) NOT NULL,
    MODIFY `area` VARCHAR(191) NOT NULL;
