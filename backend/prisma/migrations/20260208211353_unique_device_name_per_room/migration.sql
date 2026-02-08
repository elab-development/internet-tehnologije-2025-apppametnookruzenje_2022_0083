/*
  Warnings:

  - A unique constraint covering the columns `[roomId,name]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Device_roomId_name_key" ON "Device"("roomId", "name");
