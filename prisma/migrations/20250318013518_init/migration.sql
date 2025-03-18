/*
  Warnings:

  - You are about to drop the `price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `price` DROP FOREIGN KEY `Price_propertyId_fkey`;

-- AlterTable
ALTER TABLE `properties` ADD COLUMN `price` INTEGER NULL;

-- DropTable
DROP TABLE `price`;
