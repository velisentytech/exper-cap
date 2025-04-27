import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const skip = (page - 1) * pageSize;

  const [exceldata, total] = await Promise.all([
    prisma.excelData.findMany({
      where: {
        OR: [
          { machine_code: { contains: search, mode: "insensitive" } },
          { machine_desc: { contains: search, mode: "insensitive" } }
        ]
      },
      skip,
      take: pageSize,
      orderBy: {
        id: "asc",
      },
    }),
    prisma.excelData.count({
      where: {
        OR: [
          { machine_code: { contains: search, mode: "insensitive" } },
          { machine_desc: { contains: search, mode: "insensitive" } }
        ]
      },
    }),
  ]);

  const pageCount = Math.ceil(total / pageSize);

  return NextResponse.json({
    exceldata,
    pagination: {
      total,
      page,
      pageSize,
      pageCount,
    }
  });
}
