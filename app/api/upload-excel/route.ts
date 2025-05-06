import { NextRequest, NextResponse } from 'next/server';
import { read, utils } from 'xlsx';
import {prisma} from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  console.log(formData);
  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = read(buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = utils.sheet_to_json(worksheet);

  // Örnek kullanıcı ID ve başvuru numarası (şimdilik sabit)
  const userId = 1;
  const basvuruNo = `BAS-${Date.now()}`;

  // JSON verilerini UploadedExcel tablosuna kaydet
  const savedRecords = await Promise.all(
    jsonData.map(async (item: any) => {
      return prisma.uploadedExcel.create({
        data: {
          machine_code: item.machine_code || '',
          adet: Number(item.adet) || 0,
          machine_desc: item.machine_desc || '',
          power: Number(item.power) || 0,
          puan:  0,
          userId,
          basvuruNo,
        },
      });
    })
  );

  return NextResponse.json({ success: true, data: savedRecords });
}
