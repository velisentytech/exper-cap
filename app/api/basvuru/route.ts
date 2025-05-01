import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Tüm başvuruları getir
export async function GET() {
  try {
    const basvurular = await prisma.basvuru.findMany({
      orderBy: { basvuruTarihi: "desc" },
    });

    return NextResponse.json(basvurular);
  } catch (error) {
    return NextResponse.json({ error: "Veri alınamadı" }, { status: 500 });
  }
}

// POST: Yeni başvuru oluştur
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.basvuruNo || !body.unvan) {
    return NextResponse.json({ error: "Tüm alanlar zorunlu" }, { status: 400 });
  }

  try {
    const yeniBasvuru = await prisma.basvuru.create({
      data: {
        basvuruNo: body.basvuruNo,
        unvan: body.unvan,
        userId: 1, // TODO: Auth ile giriş yapan kullanıcıdan alınmalı
      },
    });

    return NextResponse.json(yeniBasvuru, { status: 201 });
  } catch (error) {
    console.error("Başvuru eklenirken hata:", error);
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
