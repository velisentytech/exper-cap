import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.uploadedExcel.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // max 100 kayıt getir
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
  }
}
