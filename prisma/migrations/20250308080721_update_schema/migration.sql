/*
  Warnings:

  - You are about to alter the column `typePropertiesName` on the `type_properties` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `type_properties` MODIFY `typePropertiesName` VARCHAR(191) NOT NULL;
