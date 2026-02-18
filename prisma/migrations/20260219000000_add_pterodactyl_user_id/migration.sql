-- AlterTable
ALTER TABLE "user" ADD COLUMN "pterodactylUserId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "user_pterodactylUserId_key" ON "user"("pterodactylUserId");
