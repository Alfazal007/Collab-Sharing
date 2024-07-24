-- CreateTable
CREATE TABLE "_PostInCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostInCommunity_AB_unique" ON "_PostInCommunity"("A", "B");

-- CreateIndex
CREATE INDEX "_PostInCommunity_B_index" ON "_PostInCommunity"("B");

-- AddForeignKey
ALTER TABLE "_PostInCommunity" ADD CONSTRAINT "_PostInCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostInCommunity" ADD CONSTRAINT "_PostInCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
