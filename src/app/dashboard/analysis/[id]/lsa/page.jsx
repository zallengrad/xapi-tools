"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { useThemeContext } from "../../../../../context/theme/ThemeContext";

// --- PERUBAHAN 1: Path Impor Komponen ---
// Path ini sekarang menunjuk ke folder 'components' lokal
import FrequencyTable from "./components/FrequencyTable";
import ZScoreTable from "./components/ZScoreTable";
import FlowDiagram from "./components/FlowDiagram";
import BehaviorChart from "./components/BehaviorChart";

export default function LsaDetailPage({ params }) {
  // Terima 'params'
  const { id } = params;
  const router = useRouter();
  const { isDark } = useThemeContext();
  const [analysisResult, setAnalysisResult] = useState(null); // Ini akan berisi data LSA
  const [metadata, setMetadata] = useState(null); // Ini akan berisi info file
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // --- PERUBAHAN 2: Logika Pengambilan Data ---
        const response = await fetch(`/api/analysis/${id}`); // API tetap sama

        if (!response.ok) {
          // ... (Error handling 404, 401 tetap sama) ...
          throw new Error("Gagal memuat hasil analisis.");
        }

        const row = await response.json(); // 'row' berisi data GABUNGAN
        if (!mounted) return;

        // Cek apakah data LSA ada di dalam payload baru
        if (row.lsaResult && row.lsaResult.payload) {
          setAnalysisResult(row.lsaResult.payload); // Ambil data dari laci LSA
        } else {
          throw new Error("Format data LSA tidak ditemukan.");
        }

        // Ambil metadata dari data Induk
        setMetadata({
          generatedAt: row.generatedAt,
          sourceFile: row.sourceFile,
          recordCount: row.recordCount,
          createdAt: row.createdAt,
        });
        // ---------------------------------------------
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data.");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [id, router]); // 'id' dari params

  const themed = (light, dark) => (isDark ? dark : light);

  const headline = useMemo(() => {
    if (!metadata) return "-";
    return metadata.sourceFile || `Analisis ${id}`;
  }, [metadata, id]);

  // Bagian <Link> "Kembali" sekarang mengarah ke halaman riwayat utama
  const backLink = "/dashboard/analysis";

  // --- (Sisa file 100% SAMA, tidak perlu diubah) ---
  // Kita tidak perlu menampilkan nama file di sini,
  // karena itu sudah ada di 'layout.jsx'

  return (
    <div className={`p-6 relative transition-colors duration-300 ${themed("text-slate-900", "text-slate-100")}`}>
      {/* Kita bisa hapus <header> nama file karena sudah ada di layout induk */}

      {/* Tombol kembali bisa dimodifikasi jika mau */}
      <Link
        href={backLink}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${themed("bg-slate-200 text-slate-700 hover:bg-slate-300", "bg-slate-800/60 text-slate-200 hover:bg-slate-800")}`}
      >
        <FiArrowLeft />
        Kembali ke Riwayat
      </Link>

      {/* Tampilkan metadata jika perlu (opsional) */}
      {metadata ? (
        <section className={`my-6 grid gap-4 rounded-3xl border p-6 transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
          {/* ... (Tampilkan metadata generatedAt, recordCount, dll) ... */}
          <p>Total Kejadian (LSA): {metadata.recordCount.toLocaleString("id-ID")}</p>
        </section>
      ) : null}

      {isLoading ? (
        <div className={`flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed text-sm transition-colors ${themed("border-slate-300 text-slate-500", "border-slate-700 text-slate-400")}`}>
          Memuat hasil analisis LSA...
        </div>
      ) : error ? (
        <div className={`flex flex-col items-center gap-3 rounded-3xl border px-6 py-12 text-center transition-colors ${themed("border-red-200 bg-red-50 text-red-600", "border-red-800/60 bg-red-900/20 text-red-200")}`}>
          <FiAlertCircle size={28} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : analysisResult ? (
        <div className="space-y-12 mt-6">
          <FrequencyTable analysisResult={analysisResult} isDarkMode={isDark} />
          <ZScoreTable analysisResult={analysisResult} isDarkMode={isDark} />
          <FlowDiagram analysisResult={analysisResult} isDarkMode={isDark} />
          <BehaviorChart transitions={analysisResult.significantTransitions ?? []} isDarkMode={isDark} />
        </div>
      ) : (
        <div className={`flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed text-sm transition-colors ${themed("border-slate-300 text-slate-500", "border-slate-700 text-slate-400")}`}>
          Hasil analisis tidak tersedia.
        </div>
      )}
    </div>
  );
}
