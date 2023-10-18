/*
  Warnings:

  - You are about to drop the column `favorite` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `loggedUserLiked` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "favorite",
DROP COLUMN "loggedUserLiked";
