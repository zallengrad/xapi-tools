"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { useThemeContext } from "../../../../context/theme/ThemeContext";
import FrequencyTable from "../components/FrequencyTable";
import ZScoreTable from "../components/ZScoreTable";
import FlowDiagram from "../components/FlowDiagram";
import BehaviorChart from "../components/BehaviorChart";

export default function AnalysisDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { isDark } = useThemeContext();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/analysis/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Hasil analisis tidak ditemukan.");
          }
          if (response.status === 401) {
            router.replace("/login");
            return;
          }
          const { error: message } = await response.json().catch(() => ({}));
          throw new Error(message || "Gagal memuat hasil analisis.");
        }

        const row = await response.json();

        if (!mounted) return;

        setAnalysisResult(row.payload);
        setMetadata({
          generatedAt: row.generatedAt,
          sourceFile: row.sourceFile,
          recordCount: row.recordCount,
          createdAt: row.createdAt,
        });
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
  }, [id, router]);

  const themed = (light, dark) => (isDark ? dark : light);

  const headline = useMemo(() => {
    if (!metadata) return "-";
    return metadata.sourceFile || `Analisis ${id}`;
  }, [metadata, id]);

  return (
    <div className={`relative min-h-screen px-6 py-8 transition-colors duration-300 ${themed("bg-slate-100 text-slate-900", "bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950 text-slate-100")}`}>
      <div className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-300 ${themed("bg-transparent", "bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.08)_0,_rgba(0,0,0,0)_60%)]")}`} />

      <div className="container mx-auto px-2 sm:px-4">
        <div className="mx-auto max-w-8xl">
          <header className="flex flex-wrap items-start justify-between gap-4 pb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/analysis")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${themed("bg-slate-200 text-slate-700 hover:bg-slate-300", "bg-slate-800/60 text-slate-200 hover:bg-slate-800")}`}
              >
                <FiArrowLeft />
                Kembali
              </button>
              <h1 className="text-2xl font-bold">{headline}</h1>
            </div>

            {metadata?.generatedAt ? (
              <div className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${themed("bg-slate-200 text-slate-600", "bg-slate-800/80 text-slate-300")}`}>
                Dibuat {new Date(metadata.generatedAt).toLocaleString("id-ID")}
              </div>
            ) : null}
          </header>

          {metadata ? (
            <section className={`mb-8 grid gap-4 rounded-3xl border p-6 transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-[0.2em] ${themed("text-slate-500", "text-slate-400")}`}>Nama Berkas</p>
                  <p className="mt-1 text-sm font-semibold">{metadata.sourceFile || "-"}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium uppercase tracking-[0.2em] ${themed("text-slate-500", "text-slate-400")}`}>Jumlah Kejadian</p>
                  <p className="mt-1 text-sm font-semibold">{(metadata.recordCount ?? 0).toLocaleString("id-ID")}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium uppercase tracking-[0.2em] ${themed("text-slate-500", "text-slate-400")}`}>Disimpan</p>
                  <p className="mt-1 text-sm font-semibold">{metadata.createdAt ? new Date(metadata.createdAt).toLocaleString("id-ID") : "-"}</p>
                </div>
              </div>
            </section>
          ) : null}

          {isLoading ? (
            <div className={`flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed text-sm transition-colors ${themed("border-slate-300 text-slate-500", "border-slate-700 text-slate-400")}`}>
              Memuat hasil analisis...
            </div>
          ) : error ? (
            <div className={`flex flex-col items-center gap-3 rounded-3xl border px-6 py-12 text-center transition-colors ${themed("border-red-200 bg-red-50 text-red-600", "border-red-800/60 bg-red-900/20 text-red-200")}`}>
              <FiAlertCircle size={28} />
              <p className="text-sm font-semibold">{error}</p>
              <Link href="/dashboard/analysis" className={`text-xs font-semibold uppercase tracking-[0.2em] ${themed("text-sky-600 hover:text-sky-500", "text-sky-300 hover:text-sky-200")}`}>
                Kembali ke Riwayat Analisis
              </Link>
            </div>
          ) : analysisResult ? (
            <div className="space-y-12">
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
      </div>
    </div>
  );
}
