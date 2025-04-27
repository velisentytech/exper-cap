import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Örnek veri
const fakeData = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  machine_code: `MC-${String(i + 1).padStart(3, "0")}`,
  machine_desc: `Makine Açıklaması ${i + 1}`,
  adet: Math.floor(Math.random() * 10) + 1,
  power: parseFloat((Math.random() * 100).toFixed(2)),
  puan: parseFloat((Math.random() * 5).toFixed(2)),
}));

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const sortField = searchParams.get("sortField") || "id";
  const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" || "asc";
  const search = searchParams.get("search")?.toLowerCase() || "";

  // Search filtresi
  let filteredData = fakeData.filter(
    (item) =>
      item.machine_code.toLowerCase().includes(search) ||
      item.machine_desc.toLowerCase().includes(search)
  );

  // Sıralama
  filteredData.sort((a, b) => {
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];

    if (aValue < bValue) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const total = filteredData.length;
  const pageCount = Math.ceil(total / pageSize);

  // Sayfalama
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return NextResponse.json({
    data: paginatedData,
    pagination: {
      total,
      page,
      pageSize,
      pageCount,
    },
  });
}
