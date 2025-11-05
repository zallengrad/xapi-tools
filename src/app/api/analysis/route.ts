"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        userId: session.user.id,
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = request.nextUrl;
    const id = url.searchParams.get("id");

    if (id) {
      const row = await prisma.analysisResult.findFirst({
        where: { id, userId: session.user.id },
      });

      if (!row) {
        return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
      }

      return NextResponse.json(row);
    }

    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.min(Number(limitParam) || 5, 50) : undefined;

    const results = await prisma.analysisResult.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/analysis error:", error);
    return NextResponse.json({ error: "Gagal mengambil hasil analisis" }, { status: 500 });
  }
}
