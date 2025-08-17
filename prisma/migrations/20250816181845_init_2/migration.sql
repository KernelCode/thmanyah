/*
  Warnings:

  - You are about to drop the column `kind` on the `ResourceResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ResourceResult" DROP COLUMN "kind";

-- DropEnum
DROP TYPE "public"."Kind";
