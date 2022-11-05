/*
  Warnings:

  - Added the required column `job` to the `Weapon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Weapon` ADD COLUMN `job` VARCHAR(191) NOT NULL;
