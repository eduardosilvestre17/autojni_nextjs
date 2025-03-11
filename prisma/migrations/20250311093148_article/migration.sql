/*
  Warnings:

  - You are about to drop the column `articletype` on the `article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `article` DROP COLUMN `articletype`,
    ADD COLUMN `articleType` VARCHAR(191) NULL;
