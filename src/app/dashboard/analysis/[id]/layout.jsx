// src/app/dashboard/analysis/[id]/layout.jsx

// Impor tetap sama
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import AnalysisDetailTabs from "./AnalysisDetailTabs";

// Fungsi getAnalysisData tetap sama
async function getAnalysisData(id, userId) {
  const row = await prisma.analysisResult.findFirst({
    where: { id: id, userId: userId },
    select: {
      sourceFile: true,
    },
  });
  if (!row) {
    notFound();
  }
  return row;
}

export default async function AnalysisIdLayout({ children, params }) {
  const session = await getServerSession(authOptions);
  const data = await getAnalysisData(params.id, session.user.id);

  return (
    // Sesuaikan padding main (p-4 sm:p-6) dari DashboardLayout
    <div className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
      {/* 2. BLOK STICKY (Wrapper untuk Sub-Header + Tabs) */}
      {/* - 'sticky top-16' menempel di bawah Header utama (h-16) */}
      {/* - 'z-10' agar tetap di atas konten */}
      {/* - 'bg-...' diperlukan agar konten scroll tidak tembus */}
      <div className="sticky top-16 z-10 bg-slate-100 dark:bg-slate-950">
        {/* 4. Wrapper untuk Tabs */}
        {/* 'px-6' untuk alignment, dan background agar konsisten */}
        <div className="px-4 sm:px-6 bg-white dark:bg-slate-900/60">
          <AnalysisDetailTabs analysisId={params.id} />
        </div>
        {/* 3. Sub-Header (Nama File) */}
        {/* Kita tambahkan 'px-6' kembali di sini */}
      </div>

      <div className="ml-8 sm:px-6 pt-10 pb-6 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">Hasil Analisis untuk:</p>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{data.sourceFile}</h2>
      </div>

      {/* 5. KONTEN (Area Scroll) */}
      {/* Kita tambahkan 'p-6' kembali agar konten Anda memiliki padding */}
      <div className="p-6 flex-1 px-4 sm:px-6 py-4">{children}</div>
    </div>
  );
}
