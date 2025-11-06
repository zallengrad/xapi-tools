"use server";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

interface RouteParams {
  params: { id: string };
}

// =========================================================
// == FUNGSI GET (READ DETAIL) - INI YANG KITA UBAH ==
// =========================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // --- PERUBAHAN UTAMA ADA DI SINI ---
    // Kita gunakan 'include' untuk mengambil data dari tabel anak
    const row = await prisma.analysisResult.findFirst({
      where: { id, userId: session.user.id },
      include: {
        lsaResult: true, // "Sertakan data dari LsaResult"
        overviewResult: true, // "Sertakan data dari OverviewResult"
      },
    });
    // ------------------------------------

    if (!row) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    // 'row' sekarang akan berisi objek seperti:
    // {
    //   id: "...",
    //   sourceFile: "...",
    //   lsaResult: { id: "...", payload: { ... } },
    //   overviewResult: { id: "...", totalEvents: 123, ... }
    // }
    return NextResponse.json(row);
  } catch (error) {
    console.error("GET /api/analysis/[id] error:", error);
    return NextResponse.json({ error: "Gagal mengambil hasil analisis" }, { status: 500 });
  }
}
