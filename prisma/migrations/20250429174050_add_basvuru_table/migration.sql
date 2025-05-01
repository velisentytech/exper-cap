-- CreateTable
CREATE TABLE "Basvuru" (
    "id" SERIAL NOT NULL,
    "basvuruNo" TEXT NOT NULL,
    "unvan" TEXT NOT NULL,
    "basvuruTarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Basvuru_pkey" PRIMARY KEY ("id")
);
