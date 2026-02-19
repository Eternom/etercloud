-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "pteroId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pteroNestId" INTEGER NOT NULL,
    "pteroEggId" INTEGER NOT NULL,
    "dockerImage" TEXT NOT NULL,
    "startup" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_category_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Server" ADD COLUMN "locationId" TEXT,
ADD COLUMN "gameCategoryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "location_pteroId_key" ON "location"("pteroId");

-- CreateIndex
CREATE UNIQUE INDEX "game_category_pteroEggId_key" ON "game_category"("pteroEggId");

-- CreateIndex
CREATE UNIQUE INDEX "game_category_pteroNestId_pteroEggId_key" ON "game_category"("pteroNestId", "pteroEggId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_gameCategoryId_fkey" FOREIGN KEY ("gameCategoryId") REFERENCES "game_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
