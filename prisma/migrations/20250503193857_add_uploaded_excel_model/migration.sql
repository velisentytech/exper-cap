-- CreateTable
CREATE TABLE "UploadedExcel" (
    "id" SERIAL NOT NULL,
    "machine_code" TEXT NOT NULL,
    "adet" INTEGER NOT NULL,
    "machine_desc" TEXT NOT NULL,
    "puan" INTEGER NOT NULL,
    "power" INTEGER NOT NULL,
    "basvuruNo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadedExcel_pkey" PRIMARY KEY ("id")
);
