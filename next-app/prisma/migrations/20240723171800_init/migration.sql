-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AdminToCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToCommunity_AB_unique" ON "_UserToCommunity"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToCommunity_B_index" ON "_UserToCommunity"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToCommunity_AB_unique" ON "_AdminToCommunity"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToCommunity_B_index" ON "_AdminToCommunity"("B");

-- AddForeignKey
ALTER TABLE "_UserToCommunity" ADD CONSTRAINT "_UserToCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToCommunity" ADD CONSTRAINT "_UserToCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToCommunity" ADD CONSTRAINT "_AdminToCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToCommunity" ADD CONSTRAINT "_AdminToCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
