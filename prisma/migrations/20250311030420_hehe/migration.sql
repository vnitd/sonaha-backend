-- AlterTable
ALTER TABLE `properties` MODIFY `house_direction` ENUM('North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest') NULL,
    MODIFY `balcony_direction` ENUM('North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest') NULL;
