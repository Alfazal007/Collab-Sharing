-- +goose Up
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'CREDENTIALS');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'GOOGLE',
    "refreshToken" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

DROP INDEX "User_username_key";

ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_UserToCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_AdminToCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

CREATE UNIQUE INDEX "_UserToCommunity_AB_unique" ON "_UserToCommunity"("A", "B");

CREATE INDEX "_UserToCommunity_B_index" ON "_UserToCommunity"("B");

CREATE UNIQUE INDEX "_AdminToCommunity_AB_unique" ON "_AdminToCommunity"("A", "B");

CREATE INDEX "_AdminToCommunity_B_index" ON "_AdminToCommunity"("B");

ALTER TABLE "_UserToCommunity" ADD CONSTRAINT "_UserToCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_UserToCommunity" ADD CONSTRAINT "_UserToCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_AdminToCommunity" ADD CONSTRAINT "_AdminToCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_AdminToCommunity" ADD CONSTRAINT "_AdminToCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_AdminToCommunity" DROP CONSTRAINT "_AdminToCommunity_A_fkey";

ALTER TABLE "_AdminToCommunity" DROP CONSTRAINT "_AdminToCommunity_B_fkey";

ALTER TABLE "Community" ADD COLUMN     "userId" TEXT NOT NULL;

DROP TABLE "_AdminToCommunity";

ALTER TABLE "Community" ADD CONSTRAINT "Community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "User" DROP COLUMN "refreshToken";
ALTER TABLE "Community" DROP CONSTRAINT "Community_userId_fkey";

ALTER TABLE "Community" ADD CONSTRAINT "Community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Post" ADD COLUMN     "userId" TEXT NOT NULL;

ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_PostInCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_PostInCommunity_AB_unique" ON "_PostInCommunity"("A", "B");

CREATE INDEX "_PostInCommunity_B_index" ON "_PostInCommunity"("B");

ALTER TABLE "_PostInCommunity" ADD CONSTRAINT "_PostInCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_PostInCommunity" ADD CONSTRAINT "_PostInCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "Save" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Save_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Save" ADD CONSTRAINT "Save_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Save" ADD COLUMN     "postId" TEXT NOT NULL;

ALTER TABLE "Save" ADD CONSTRAINT "Save_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Message" ADD CONSTRAINT "Message_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Message" ADD CONSTRAINT "Message_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Message" DROP CONSTRAINT "Message_fromUserId_fkey";

ALTER TABLE "Message" DROP CONSTRAINT "Message_toUserId_fkey";

ALTER TABLE "Message" ADD CONSTRAINT "Message_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message" ADD CONSTRAINT "Message_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD COLUMN "message" TEXT NOT NULL;
