"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; //
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; ///route.ts]

// =========================================================
// == FUNGSI POST (CREATE) - INI YANG KITA UBAH TOTAL ==
// =========================================================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Terima payload dengan struktur baru
    const { fileInfo, lsaData, overviewData } = await request.json();

    // 2. Validasi payload baru
    if (!fileInfo || !lsaData || !overviewData) {
      return NextResponse.json({ error: "Payload tidak lengkap" }, { status: 400 });
    }

    // 3. Gunakan Transaksi Prisma
    // Ini memastikan ketiga data (Induk, LSA, Overview) berhasil dibuat
    // atau semuanya akan dibatalkan jika ada error.
    const newAnalysis = await prisma.$transaction(async (tx) => {
      // 'tx' adalah klien Prisma khusus untuk transaksi ini

      // Langkah A: Buat data Induk (AnalysisResult)
      const analysis = await tx.analysisResult.create({
        data: {
          sourceFile: fileInfo.sourceFile,
          recordCount: fileInfo.recordCount,
          generatedAt: new Date(fileInfo.generatedAt),
          userId: session.user.id,
        },
      });

      // Langkah B: Buat data Laci Overview
      // Kita gunakan 'spread operator' (...) untuk memasukkan semua KPI
      await tx.overviewResult.create({
        data: {
          ...overviewData,
          // Hubungkan ke Induk yang baru dibuat
          analysisResultId: analysis.id,
        },
      });

      // Langkah C: Buat data Laci LSA
      await tx.lsaResult.create({
        data: {
          payload: lsaData, // Simpan JSON LSA di sini
          // Hubungkan ke Induk yang baru dibuat
          analysisResultId: analysis.id,
        },
      });

      // Kembalikan data Induk yang baru dibuat
      return analysis;
    });

    // 4. Kirim kembali ID dari data Induk yang baru
    return NextResponse.json({ id: newAnalysis.id });
  } catch (error) {
    console.error("POST /api/analysis error:", error);
    return NextResponse.json({ error: "Gagal menyimpan hasil analisis" }, { status: 500 });
  }
}

// =========================================================
// == FUNGSI GET (READ) - TIDAK PERLU DIUBAH ==
// =========================================================
// Fungsi GET Anda (untuk halaman riwayat) masih berfungsi
// karena kita masih mengambil daftar dari 'AnalysisResult'
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = request.nextUrl;
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.min(Number(limitParam) || 5, 50) : undefined;

    const results = await prisma.analysisResult.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      // Kita tidak perlu 'include' data LSA/Overview di sini
      // agar halaman riwayat tetap cepat.
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/analysis error:", error);
    return NextResponse.json({ error: "Gagal mengambil hasil analisis" }, { status: 500 });
  }
}
