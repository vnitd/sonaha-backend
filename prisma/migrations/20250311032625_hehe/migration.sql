/*
  Warnings:

  - You are about to alter the column `house_direction` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `VarChar(191)`.
  - You are about to alter the column `balcony_direction` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `properties` MODIFY `house_direction` VARCHAR(191) NULL,
    MODIFY `balcony_direction` VARCHAR(191) NULL;
