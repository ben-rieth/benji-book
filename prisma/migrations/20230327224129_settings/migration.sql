-- CreateEnum
CREATE TYPE "NotificationLocation" AS ENUM ('TOPLEFT', 'TOPCENTER', 'TOPRIGHT', 'BOTTOMLEFT', 'BOTTOMCENTER', 'BOTTOMRIGHT');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('DARK', 'LIGHT', 'SYSTEM');

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationLocation" "NotificationLocation" NOT NULL DEFAULT 'BOTTOMRIGHT',
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
