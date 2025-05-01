// components/basvuru-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Basvuru = {
  id: number;
  basvuruNo: string;
  unvan: string;
  basvuruTarihi: string;
};

export const columns: ColumnDef<Basvuru>[] = [
  {
    accessorKey: "basvuruNo",
    header: "Başvuru No",
  },
  {
    accessorKey: "unvan",
    header: "Ünvan",
  },
  {
    accessorKey: "basvuruTarihi",
    header: "Başvuru Tarihi",
  },
];
