-- DropForeignKey
ALTER TABLE "Community" DROP CONSTRAINT "Community_userId_fkey";

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
