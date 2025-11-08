"use client";

import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { useThemeContext } from "@/context/theme/ThemeContext";
import SessionKpiGrid from "./components/SessionKpiGrid";
import FunnelConversionChart from "./components/FunnelConversionChart";
import SessionDurationHistogram from "./components/SessionDurationHistogram";

export default function FunnelAnalysisPage({ params }) {
  const { isDark } = useThemeContext();
  const [funnelData, setFunnelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const themed = (light, dark) => (isDark ? dark : light);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/analysis/${params.id}`);
        if (!response.ok) {
          const { error: message } = await response.json().catch(() => ({}));
          throw new Error(message || "Gagal memuat data funnel.");
        }

        const payload = await response.json();
        if (!mounted) return;

        if (!payload?.funnelResult) {
          throw new Error("Data funnel tidak tersedia untuk analisis ini.");
        }

        setFunnelData(payload.funnelResult);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data funnel.");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (isLoading) {
    return <div className={`flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed text-sm ${themed("border-slate-300 text-slate-500", "border-slate-700 text-slate-400")}`}>Memuat analisis funnel & sesi...</div>;
  }

  if (error) {
    return (
      <div className={`flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-3xl border px-6 py-12 text-center ${themed("border-red-200 bg-red-50 text-red-600", "border-red-800/70 bg-red-900/20 text-red-200")}`}>
        <FiAlertCircle size={24} />
        <p className="text-sm font-semibold">{error}</p>
      </div>
    );
  }

  if (!funnelData) {
    return <div className={`flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed text-sm ${themed("border-slate-300 text-slate-500", "border-slate-700 text-slate-400")}`}>Data funnel tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <SessionKpiGrid data={funnelData} isDark={isDark} />
      <div className="grid gap-6 xl:grid-cols-2">
        <FunnelConversionChart steps={funnelData.funnelSteps || []} isDark={isDark} />
        <SessionDurationHistogram histogram={funnelData.sessionDurationHistogram || []} isDark={isDark} />
      </div>
    </div>
  );
}
