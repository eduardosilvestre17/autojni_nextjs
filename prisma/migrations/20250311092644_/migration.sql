/*
  Warnings:

  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `product`;

-- CreateTable
CREATE TABLE `Article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `articletype` VARCHAR(191) NULL,
    `purchasingPrice` DOUBLE NULL,
    `sellingPrice` DOUBLE NULL,
    `active` BOOLEAN NOT NULL,
    `brand` VARCHAR(191) NULL,
    `stockQuantity` INTEGER NULL,
    `imageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
