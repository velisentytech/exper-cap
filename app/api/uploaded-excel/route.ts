import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const basvuruNo = searchParams.get("basvuruNo");
    const data = await prisma.uploadedExcel.findMany({
      where: basvuruNo ? { basvuruNo } : {},
      orderBy: { createdAt: 'desc' },
      take: 100, 
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
  }
}
