/*
  Warnings:

  - You are about to drop the column `end_date` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `link_url` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `cost_price` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `description_detail` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `price_difference` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `type_properties` table. All the data in the column will be lost.
  - You are about to drop the `save` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `propertyId` to the `banners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_propertiesID` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `save` DROP FOREIGN KEY `save_ibfk_1`;

-- DropForeignKey
ALTER TABLE `save` DROP FOREIGN KEY `save_ibfk_2`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_ibfk_1`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_ibfk_3`;

-- DropForeignKey
ALTER TABLE `type_properties` DROP FOREIGN KEY `type_properties_ibfk_1`;

-- DropIndex
DROP INDEX `propertyId` ON `type_properties`;

-- AlterTable
ALTER TABLE `banners` DROP COLUMN `end_date`,
    DROP COLUMN `link_url`,
    DROP COLUMN `start_date`,
    ADD COLUMN `propertyId` INTEGER NOT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `contact_forms` MODIFY `email` VARCHAR(255) NULL,
    MODIFY `phone` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `properties` DROP COLUMN `address`,
    DROP COLUMN `coordinates`,
    DROP COLUMN `cost_price`,
    DROP COLUMN `description`,
    DROP COLUMN `description_detail`,
    DROP COLUMN `price_difference`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `road_surface` VARCHAR(255) NULL,
    ADD COLUMN `type_propertiesID` INTEGER NOT NULL,
    MODIFY `public_price` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `type_properties` DROP COLUMN `propertyId`;

-- DropTable
DROP TABLE `save`;

-- DropTable
DROP TABLE `transactions`;

-- CreateTable
CREATE TABLE `content_property` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `title` TEXT NOT NULL,
    `content` TEXT NOT NULL,

    INDEX `property_id`(`property_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `introductions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `thumbnail` VARCHAR(255) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recruitments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `requirements` TEXT NULL,
    `location` VARCHAR(255) NULL,
    `salary` VARCHAR(255) NULL,
    `deadline` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `summary` TEXT NULL,
    `content` TEXT NOT NULL,
    `thumbnail` VARCHAR(255) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `propertyId` ON `banners`(`propertyId`);

-- CreateIndex
CREATE INDEX `type_propertiesID` ON `properties`(`type_propertiesID`);

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`type_propertiesID`) REFERENCES `type_properties`(`typePropertiesId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `banners` ADD CONSTRAINT `banners_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`property_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `content_property` ADD CONSTRAINT `content_property_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
