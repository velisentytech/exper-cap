import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const codesParam = url.searchParams.get('codes');
    
    if (!codesParam) {
      return NextResponse.json({ error: 'Machine codes are required' }, { status: 400 });
    }
    
    const machineCodes = codesParam.split(',');
    
    // Önce makine kodlarına göre makineleri bulalım
    const machines = await prisma.machine.findMany({
      where: {
        machine_code: {
          in: machineCodes
        }
      },
      select: {
        id: true,
        machine_code: true,
        category: true
      }
    });
    
    // Makine kategorilerine göre machine_group_category verilerini bulalım
    const categories = machines.map(m => m.category);
    
    const machineGroupCategories = await prisma.machine_group_category.findMany({
      where: {
        category_id: {
          in: categories
        }
      }
    });
    
    // Makine kodlarını ve kategori bilgilerini birleştirelim
    const result = machineGroupCategories.map(mgc => {
      const relatedMachines = machines.filter(m => m.category === mgc.category_id);
      
      return relatedMachines.map(rm => ({
        ...mgc,
        machine_code: rm.machine_code
      }));
    }).flat();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching machine categories:', error);
    return NextResponse.json({ error: 'Failed to fetch machine categories' }, { status: 500 });
  }
}
