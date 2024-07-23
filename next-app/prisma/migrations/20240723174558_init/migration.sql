/*
  Warnings:

  - You are about to drop the `_AdminToCommunity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AdminToCommunity" DROP CONSTRAINT "_AdminToCommunity_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminToCommunity" DROP CONSTRAINT "_AdminToCommunity_B_fkey";

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AdminToCommunity";

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
