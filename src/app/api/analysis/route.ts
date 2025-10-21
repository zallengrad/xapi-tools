"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { sourceFile, recordCount, generatedAt, analysis } = await request.json();

    if (!analysis || typeof recordCount !== "number" || !sourceFile || !generatedAt) {
      return NextResponse.json({ error: "Payload tidak lengkap" }, { status: 400 });
    }

    const row = await prisma.analysisResult.create({
      data: {
        sourceFile,
        recordCount,
        generatedAt: new Date(generatedAt),
        payload: analysis,
      },
    });

    return NextResponse.json({ id: row.id });
  } catch (error) {
    console.error("POST /api/analysis error:", error);
    return NextResponse.json({ error: "Gagal menyimpan hasil analisis" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Parameter id wajib diisi" }, { status: 400 });
    }

    const row = await prisma.analysisResult.findUnique({ where: { id } });

    if (!row) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(row);
  } catch (error) {
    console.error("GET /api/analysis error:", error);
    return NextResponse.json({ error: "Gagal mengambil hasil analisis" }, { status: 500 });
  }
}
