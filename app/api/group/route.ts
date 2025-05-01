import { prisma } from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";

export async function GET() {
    try {
      const groups = await prisma.group.findMany({
        orderBy:{
            id:'asc'
        }
      });
      return NextResponse.json(groups);
    } catch (error) {
      return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 });
    }
  }