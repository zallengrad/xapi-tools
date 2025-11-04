"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useThemeContext } from "../../../context/theme/ThemeContext";
import FrequencyTable from "./components/FrequencyTable";
import ZScoreTable from "./components/ZScoreTable";
import FlowDiagram from "./components/FlowDiagram";
import BehaviorChart from "./components/BehaviorChart";
import AnalysisHistory from "./components/AnalysisHistory";

const MOCK_ANALYSIS_HISTORY = [
  {
    id: "lsa-20240501-01",
    title: "kelas-algo-a.csv",
    description: "Transisi terkuat: B1 -> B3 (Z = 2.14). Fokus pada fase debugging.",
    createdAt: "12 Mei 2024, 10:42 WIB",
    recordCount: 428,
    cohort: "Angkatan 2024 - Sesi Pagi",
    tag: "Algoritma",
  },
  {
    id: "lsa-20240417-02",
    title: "xapi-lab-b.csv",
    description: "Aktivitas kolaborasi meningkat setelah intervensi modul video.",
    createdAt: "28 April 2024, 14:07 WIB",
    recordCount: 312,
    cohort: "Kelompok B2 - Laboratorium",
    tag: "Eksperimen",
  },
  {
    id: "lsa-20240401-07",
    title: "learning-path-s10.csv",
    description: "Pola baru: B2 -> B4 memberikan dampak negatif (Z = -1.72).",
    createdAt: "02 April 2024, 09:15 WIB",
    recordCount: 198,
    cohort: "Sesi Mandiri - Sprint 10",
    tag: "Insight",
  },
];

const AnalysisPage = () => {
  const searchParams = useSearchParams();
  const { isDark } = useThemeContext();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const id = searchParams.get("id");

      if (!id) {
        setError("Tidak ada data untuk dianalisis. Silakan kembali ke halaman Convert untuk mengunggah file.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/analysis?id=${id}`);

        if (!response.ok) {
          const { error: message } = await response.json();
          throw new Error(message || "Gagal memuat hasil analisis.");
        }

        const row = await response.json();

        setAnalysisResult(row.payload);
        setMetadata({
          generatedAt: row.generatedAt,
          sourceFile: row.sourceFile,
          recordCount: row.recordCount,
        });
        setIsLoading(false);
      } catch (e) {
        console.error("Error mengambil hasil analisis:", e);
        setError(e instanceof Error ? e.message : "Terjadi kesalahan saat mengambil data.");
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const themed = (light, dark) => (isDark ? dark : light);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center rounded-3xl border border-dashed transition-colors duration-300">
          <p className={`px-6 py-10 text-center text-sm ${themed("text-slate-500", "text-slate-300")}`}>Memuat dan menganalisis data...</p>
        </div>
      );
    }

    if (error) {
      return <div className={`rounded-3xl border px-6 py-10 text-center text-sm font-semibold transition-colors duration-300 ${themed("border-red-200 text-red-600", "border-red-800/60 text-red-300")}`}>{error}</div>;
    }

    if (analysisResult) {
      return (
        <div className="space-y-12">
          <FrequencyTable analysisResult={analysisResult} isDarkMode={isDark} />
          <ZScoreTable analysisResult={analysisResult} isDarkMode={isDark} />
          <FlowDiagram analysisResult={analysisResult} isDarkMode={isDark} />
          <BehaviorChart transitions={analysisResult.significantTransitions ?? []} isDarkMode={isDark} />
        </div>
      );
    }

    return null;
  };

  const pageBackground = isDark ? "bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";
  const backdropClass = isDark ? "bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.08)_0,_rgba(0,0,0,0)_60%)]" : "bg-transparent";
  const renderedContent = renderContent();

  return (
    <div className={`relative min-h-screen px-6 py-8 transition-colors duration-300 ${pageBackground}`}>
      <div className={`absolute inset-0 -z-10 transition-colors duration-300 ${backdropClass}`} />

      <div className="container mx-auto">
        <div className="mx-auto max-w-8xl">
          <h1 className={`mb-6 text-center text-3xl font-bold transition-colors ${themed("text-slate-900", "text-white")}`}>Hasil Analisis Sekuensial Lag (LSA)</h1>

          {metadata ? (
            <p className={`text-center text-sm transition-colors ${themed("text-slate-500", "text-slate-400")}`}>
              Sumber: <span className="font-medium">{metadata.sourceFile}</span> | {metadata.recordCount} kejadian | Dibuat {new Date(metadata.generatedAt).toLocaleString("id-ID")}
            </p>
          ) : (
            <p className={`text-center text-sm transition-colors ${themed("text-slate-500", "text-slate-400")}`}>Gunakan panel riwayat di sebelah kiri untuk melihat contoh hasil analisis yang telah disimulasikan.</p>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-[340px,1fr]">
            <AnalysisHistory title="Riwayat Analisis" subtitle="Kumpulan ringkas hasil LSA terbaru yang pernah dijalankan." items={MOCK_ANALYSIS_HISTORY} isDark={isDark} />

            <div className="flex min-h-[320px] flex-col">
              {renderedContent ?? (
                <div
                  className={`flex flex-1 items-center justify-center rounded-3xl border border-dashed px-6 text-center text-sm leading-relaxed transition-colors ${themed(
                    "border-slate-300 text-slate-500",
                    "border-slate-700 text-slate-400"
                  )}`}
                >
                  Belum ada hasil yang dimuat. Pilih salah satu riwayat di kiri untuk simulasi, atau unggah file baru di halaman Convert.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
