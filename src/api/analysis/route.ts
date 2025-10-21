import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { sourceFile, recordCount, generatedAt, analysis } = await req.json();

  const row = await prisma.analysisResult.create({
    data: {
      sourceFile,
      recordCount,
      generatedAt: new Date(generatedAt),
      payload: analysis,
    },
  });

  return NextResponse.json({ id: row.id });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const row = await prisma.analysisResult.findUnique({ where: { id } });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}
