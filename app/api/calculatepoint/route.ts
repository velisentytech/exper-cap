import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { 
      machineCode, 
      machineGroupCategoryId, 
      groupId 
    } = data;
    
    if (!machineCode || !machineGroupCategoryId || !groupId) {
      return NextResponse.json({ 
        error: 'Machine code, machine group category ID and group ID are required' 
      }, { status: 400 });
    }
    
    // Önce machine bilgisini alalım
    const machine = await prisma.machine.findFirst({
      where: {
        machine_code: machineCode
      }
    });
    
    if (!machine) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    }
    
    // Machine group category bilgisini alalım
    const machineGroupCategory = await prisma.machine_group_category.findUnique({
      where: {
        id: parseInt(machineGroupCategoryId)
      }
    });
    
    if (!machineGroupCategory) {
      return NextResponse.json({ error: 'Machine group category not found' }, { status: 404 });
    }
    
    // Excel data bilgisini alalım
    const excelData = await prisma.uploadedExcel.findFirst({
      where: {
        machine_code: machineCode
      }
    });
    
    if (!excelData) {
      return NextResponse.json({ error: 'Excel data not found' }, { status: 404 });
    }
    
    // Group bilgisini alalım
    const group = await prisma.group.findUnique({
      where: {
        id: parseInt(groupId)
      }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Category kontrolü ve grup değerini seçme
    let groupValue = 0;
    
    if (machine.category === "2") {
      // Grup numarasına göre ilgili sütunu seç
      switch (parseInt(groupId)) {
        case 1:
          groupValue = machineGroupCategory.group1;
          break;
        case 2:
          groupValue = machineGroupCategory.group2;
          break;
        case 3:
          groupValue = machineGroupCategory.group3;
          break;
        case 4:
          groupValue = machineGroupCategory.group4;
          break;
        case 5:
          groupValue = machineGroupCategory.group5;
          break;
        case 6:
          groupValue = machineGroupCategory.group6;
          break;
        case 7:
          groupValue = machineGroupCategory.group7;
          break;
        default:
          groupValue = 0;
      }
    }
    
    // Puanı hesapla ve güncelle
    // Grup katsayısını hesaplamaya dahil ediyoruz
    const calculatedPoint = excelData.adet * groupValue * group.katsayi;
    
    // Excel data'yı güncelle
    const updatedExcelData = await prisma.uploadedExcel.update({
      where: {
        id: excelData.id
      },
      data: {
        puan: calculatedPoint
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Point calculated and updated successfully',
      data: updatedExcelData
    });
    
  } catch (error) {
    console.error('Error calculating point:', error);
    return NextResponse.json({ error: 'Failed to calculate point' }, { status: 500 });
  }
}