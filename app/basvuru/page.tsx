"use client"
import { BasvuruTable } from "@/components/basvuru/basvuru-table";

export type Basvuru = {
    id: number;
    basvuruNo: string;
    unvan: string;
    basvuruTarihi: string;
  };

async function getBasvurular(): Promise<Basvuru[]> {
  try {
    const res = await fetch(`/api/basvuru`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Başvurular alınamadı");

    return res.json();
  } catch {
    return [];
  }
}

export default async function BasvuruPage() {
  const initialData = await getBasvurular();

  return (
    <div className="container py-10">
      <BasvuruTable initialData={initialData} />
    </div>
  );
}
