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
        funnelResult: true, // Sertakan data funnel & sesi
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

// =========================================================
// == FUNGSI PATCH (RENAME) ==
// =========================================================
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const rawName = typeof body?.sourceFile === "string" ? body.sourceFile.trim() : "";

    if (!rawName) {
      return NextResponse.json({ error: "Nama file tidak boleh kosong" }, { status: 400 });
    }

    const existing = await prisma.analysisResult.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.analysisResult.update({
      where: { id },
      data: { sourceFile: rawName },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/analysis/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui nama analisis" }, { status: 500 });
  }
}

// =========================================================
// == FUNGSI DELETE (HAPUS ANALISIS) ==
// =========================================================
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const existing = await prisma.analysisResult.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    await prisma.analysisResult.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/analysis/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus hasil analisis" }, { status: 500 });
  }
}
