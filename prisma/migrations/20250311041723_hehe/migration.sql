/*
  Warnings:

  - You are about to drop the column `public_price` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `properties` DROP COLUMN `public_price`;

-- CreateTable
CREATE TABLE `Price` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propertyId` INTEGER NOT NULL,
    `price_type` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,

    INDEX `properties`(`propertyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Price` ADD CONSTRAINT `Price_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`property_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
