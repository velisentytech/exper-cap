-- CreateTable
CREATE TABLE "ExcelData" (
    "id" SERIAL NOT NULL,
    "machine_code" TEXT NOT NULL,
    "adet" INTEGER NOT NULL,
    "machine_desc" TEXT NOT NULL,
    "puan" INTEGER NOT NULL,
    "power" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExcelData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "katsayi" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "machine_code" TEXT NOT NULL,
    "machine_desc" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "category_id" TEXT NOT NULL,
    "category_desc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine_group_category" (
    "id" SERIAL NOT NULL,
    "machine_desc" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "group1" INTEGER NOT NULL,
    "group2" INTEGER NOT NULL,
    "group3" INTEGER NOT NULL,
    "group4" INTEGER NOT NULL,
    "group5" INTEGER NOT NULL,
    "group6" INTEGER NOT NULL,
    "group7" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machine_group_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MachineToCategoryGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MachineToCategoryGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_machine_code_key" ON "Machine"("machine_code");

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_id_key" ON "Category"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_MachineToCategoryGroup_B_index" ON "_MachineToCategoryGroup"("B");

-- AddForeignKey
ALTER TABLE "ExcelData" ADD CONSTRAINT "ExcelData_machine_code_fkey" FOREIGN KEY ("machine_code") REFERENCES "Machine"("machine_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_group_category" ADD CONSTRAINT "machine_group_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MachineToCategoryGroup" ADD CONSTRAINT "_MachineToCategoryGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MachineToCategoryGroup" ADD CONSTRAINT "_MachineToCategoryGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "machine_group_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
