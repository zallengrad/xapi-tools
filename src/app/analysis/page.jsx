"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useThemeContext } from "../../context/theme/ThemeContext";
import ThemeToggle from "../../components/ui/ThemeToggle";
import FrequencyTable from "./components/FrequencyTable";
import ZScoreTable from "./components/ZScoreTable";
import FlowDiagram from "./components/FlowDiagram";
import BehaviorChart from "./components/BehaviorChart";

const AnalysisPage = () => {
  const searchParams = useSearchParams();
  const { isDark, toggle, ready } = useThemeContext();
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
      return <p className={`text-center transition-colors ${themed("text-slate-500", "text-slate-400")}`}>Memuat dan menganalisis data...</p>;
    }

    if (error) {
      return <p className={`text-center font-semibold transition-colors ${themed("text-red-600", "text-red-400")}`}>{error}</p>;
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

  const pageBackground = isDark ? "bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950 text-slate-100" : "bg-white text-slate-900";

  const backdropClass = isDark ? "bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.08)_0,_rgba(0,0,0,0)_60%)]" : "bg-transparent";

  return (
    <div className={`relative min-h-screen px-6 py-8 transition-colors duration-300 ${pageBackground}`}>
      <div className={`absolute inset-0 -z-10 transition-colors duration-300 ${backdropClass}`} />

      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-6">{ready && <ThemeToggle isDark={isDark} onToggle={toggle} />}</div>

          <h1 className={`text-3xl font-bold mb-6 text-center transition-colors ${themed("text-slate-900", "text-white")}`}>Hasil Analisis Sekuensial Lag (LSA)</h1>

          {metadata && (
            <p className={`text-center text-sm transition-colors ${themed("text-slate-500", "text-slate-400")}`}>
              Sumber: <span className="font-medium">{metadata.sourceFile}</span> • {metadata.recordCount} kejadian • Dibuat {new Date(metadata.generatedAt).toLocaleString("id-ID")}
            </p>
          )}

          <div className="mt-8">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
