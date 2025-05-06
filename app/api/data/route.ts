import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    
    // Pagination parametreleri
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    
    // Sorting parametreleri
    const sortField = url.searchParams.get('sortField') || 'id';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    
    // Arama parametresi
    const search = url.searchParams.get('search') || '';
    
    // Filtreleme koşulları
    const where = search 
      ? {
          OR: [
            { machine_code: { contains: search, mode: 'insensitive' as const } },
            { machine_desc: { contains: search, mode: 'insensitive' as const } },
          ],
        } 
      : {};
    
    // Toplam kayıt sayısı
    const total = await prisma.uploadedExcel.count({ where });
    
    // Verileri getir
    const data = await prisma.uploadedExcel.findMany({
      where,
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    
    return NextResponse.json({ 
      data, 
      pagination: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize)
      } 
    });
  } catch (error) {
    console.error('Data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}