-- AlterTable
ALTER TABLE `properties` MODIFY `status` ENUM('available', 'sold', 'pending') NULL DEFAULT 'available';
