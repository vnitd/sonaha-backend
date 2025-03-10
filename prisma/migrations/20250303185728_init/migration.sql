-- CreateTable
CREATE TABLE `comments` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `comment_text` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `parent_comment_id` INTEGER NULL,

    INDEX `property_id`(`property_id`),
    INDEX `user_id`(`user_id`),
    INDEX `fk_parent_comment`(`parent_comment_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('comment', 'general') NULL DEFAULT 'comment',
    `status` ENUM('unread', 'read') NULL DEFAULT 'unread',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `link` TEXT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `properties` (
    `property_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `public_price` INTEGER NOT NULL,
    `area` FLOAT NULL,
    `status` ENUM('available', 'sold', 'pending') NULL DEFAULT 'available',
    `thumbnail_url` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cost_price` INTEGER NULL,
    `province` VARCHAR(255) NULL,
    `district` VARCHAR(255) NULL,
    `ward` VARCHAR(255) NULL,
    `coordinates` VARCHAR(255) NULL,
    `house_direction` ENUM('North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest') NOT NULL,
    `number_of_bedrooms` INTEGER NULL,
    `legal_status` VARCHAR(255) NULL,
    `balcony_direction` ENUM('North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest') NOT NULL,
    `number_of_bathrooms` INTEGER NULL,
    `furniture` VARCHAR(255) NULL,
    `house_number` VARCHAR(50) NULL,
    `description_detail` VARCHAR(255) NULL,
    `price_difference` INTEGER NULL,
    `address` VARCHAR(255) NULL,

    PRIMARY KEY (`property_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property_images` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `uploaded_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `property_id`(`property_id`),
    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `save` (
    `user_id` INTEGER NOT NULL,
    `property_id` INTEGER NOT NULL,
    `date_save` DATE NULL,

    INDEX `property_id`(`property_id`),
    PRIMARY KEY (`user_id`, `property_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type_properties` (
    `typePropertiesId` INTEGER NOT NULL AUTO_INCREMENT,
    `propertyId` INTEGER NOT NULL,
    `typePropertiesName` ENUM('Apartment', 'OfficeBuilding', 'ShoppingCenter', 'NewUrbanArea', 'MixedUseDevelopment', 'SocialHousing', 'EcoResort', 'IndustrialPark', 'SemiDetachedVilla', 'Shophouse', 'Townhouse', 'OtherProject', 'BeachLand', 'PerennialCropLand', 'Villa', 'ResidentialPlot', 'StreetHouse', 'LuxuryApartment') NOT NULL,

    INDEX `propertyId`(`propertyId`),
    PRIMARY KEY (`typePropertiesId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `role_name` ENUM('admin', 'employee', 'user', 'moderator', 'manager') NOT NULL,
    `face_id` VARCHAR(255) NULL,
    `refresh_token` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `access_token` TEXT NULL,
    `avartar_url` TEXT NULL,
    `reset_token` TEXT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `banner_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `link_url` VARCHAR(255) NULL,
    `start_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `end_date` TIMESTAMP(0) NULL,

    PRIMARY KEY (`banner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `inquiry_id` INTEGER NOT NULL AUTO_INCREMENT,
    `property_id` INTEGER NOT NULL,
    `moderator_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'in_progress', 'completed') NULL DEFAULT 'pending',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `moderator_id`(`moderator_id`),
    INDEX `property_id`(`property_id`),
    PRIMARY KEY (`inquiry_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_transactions_stats` (
    `stat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATETIME(3) NOT NULL,
    `transaction_total_perday` INTEGER NOT NULL DEFAULT 0,
    `total_revenue_perday` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `daily_transactions_stats_transaction_date_key`(`transaction_date`),
    PRIMARY KEY (`stat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administrative_regions` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NOT NULL,
    `code_name` VARCHAR(255) NULL,
    `code_name_en` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administrative_units` (
    `id` INTEGER NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `full_name_en` VARCHAR(255) NULL,
    `short_name` VARCHAR(255) NULL,
    `short_name_en` VARCHAR(255) NULL,
    `code_name` VARCHAR(255) NULL,
    `code_name_en` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NULL,
    `full_name` VARCHAR(255) NULL,
    `full_name_en` VARCHAR(255) NULL,
    `code_name` VARCHAR(255) NULL,
    `province_code` VARCHAR(20) NULL,
    `administrative_unit_id` INTEGER NULL,

    INDEX `idx_districts_province`(`province_code`),
    INDEX `idx_districts_unit`(`administrative_unit_id`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provinces` (
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `full_name_en` VARCHAR(255) NULL,
    `code_name` VARCHAR(255) NULL,
    `administrative_unit_id` INTEGER NULL,
    `administrative_region_id` INTEGER NULL,

    INDEX `idx_provinces_region`(`administrative_region_id`),
    INDEX `idx_provinces_unit`(`administrative_unit_id`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wards` (
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `name_en` VARCHAR(255) NULL,
    `full_name` VARCHAR(255) NULL,
    `full_name_en` VARCHAR(255) NULL,
    `code_name` VARCHAR(255) NULL,
    `district_code` VARCHAR(20) NULL,
    `administrative_unit_id` INTEGER NULL,

    INDEX `idx_wards_district`(`district_code`),
    INDEX `idx_wards_unit`(`administrative_unit_id`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `fk_parent_comment` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments`(`comment_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `property_images` ADD CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `save` ADD CONSTRAINT `save_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `save` ADD CONSTRAINT `save_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `type_properties` ADD CONSTRAINT `type_properties_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`property_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties`(`property_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`moderator_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `administrative_units`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_province_code_fkey` FOREIGN KEY (`province_code`) REFERENCES `provinces`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `provinces` ADD CONSTRAINT `provinces_administrative_region_id_fkey` FOREIGN KEY (`administrative_region_id`) REFERENCES `administrative_regions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `provinces` ADD CONSTRAINT `provinces_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `administrative_units`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `wards` ADD CONSTRAINT `wards_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `administrative_units`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `wards` ADD CONSTRAINT `wards_district_code_fkey` FOREIGN KEY (`district_code`) REFERENCES `districts`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;
