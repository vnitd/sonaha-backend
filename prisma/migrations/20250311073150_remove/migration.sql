/*
  Warnings:

  - You are about to drop the `banners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `banners` DROP FOREIGN KEY `banners_ibfk_1`;

-- AlterTable
ALTER TABLE `properties` ADD COLUMN `banner_status` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `banners`;
