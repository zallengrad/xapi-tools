"use client";

import { useState, useEffect, useMemo } from "react";
import { useThemeContext } from "@/context/theme/ThemeContext";
import { FiCalendar, FiDatabase, FiUsers, FiList, FiCheckCircle } from "react-icons/fi";

// --- PERUBAHAN 1: Path Impor Komponen ---
import KpiCard from "./components/KpiCard";
import ActivityChart from "./components/ActivityChart";
import TopVerbsChart from "./components/TopVerbsChart";
import TopContentTable from "./components/TopContentTable";

export default function OverviewPage({ params }) {
  // Terima 'params'
  const { isDark } = useThemeContext();
  const [filter, setFilter] = useState("7d");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  // --- PERUBAHAN 2: State untuk Data Asli ---
  const [overviewData, setOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // ------------------------------------------

  // --- PERUBAHAN 3: useEffect untuk Mengambil Data ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/analysis/${params.id}`);
        if (!response.ok) throw new Error("Gagal memuat data analisis.");

        const data = await response.json();

        // Ekstrak data 'overviewResult' dari payload baru
        if (data.overviewResult) {
          setOverviewData(data.overviewResult);
        } else {
          throw new Error("Format data overview tidak valid.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]); // Ambil data saat 'id' berubah
  // --------------------------------------------------

  const themed = (light, dark) => (isDark ? dark : light);

  const FilterButton = ({ value, label }) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      className={`
        px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors whitespace-nowrap
        ${filter === value ? "bg-sky-600 text-white" : themed("bg-white hover:bg-slate-50 text-slate-700", "bg-slate-800 hover:bg-slate-700 text-slate-200")}
      `}
    >
      {label}
    </button>
  );

  const filteredDailyActivity = useMemo(() => {
    if (!overviewData?.dailyActivity) return [];
    const entries = overviewData.dailyActivity;

    if (filter === "7d") {
      return entries.slice(Math.max(entries.length - 7, 0));
    }

    if (filter === "30d") {
      return entries.slice(Math.max(entries.length - 30, 0));
    }

    if (filter === "custom") {
      const { start, end } = customRange;
      if (!start && !end) return entries;

      return entries.filter((item) => {
        const dateStr = item.date?.split("T")?.[0] || item.date;
        if (!dateStr) return false;
        if (start && dateStr < start) return false;
        if (end && dateStr > end) return false;
        return true;
      });
    }

    return entries;
  }, [overviewData, filter, customRange]);

  const customRangeActive = filter === "custom";
  const customRangeHint = customRangeActive && filteredDailyActivity.length === 0 ? "Tidak ada data pada rentang tersebut." : "";

  // --- PERUBAHAN 4: Tambahkan State Loading/Error ---
  if (isLoading) {
    return <div className={`flex min-h-[400px] items-center justify-center rounded-3xl text-sm ${themed("text-slate-500", "text-slate-400")}`}>Memuat data overview...</div>;
  }

  if (error) {
    return <div className={`flex min-h-[400px] items-center justify-center rounded-3xl text-sm font-semibold ${themed("text-red-600", "text-red-300")}`}>{error}</div>;
  }

  if (!overviewData) {
    return <div className={`flex min-h-[400px] items-center justify-center rounded-3xl text-sm ${themed("text-slate-500", "text-slate-400")}`}>Data overview tidak ditemukan untuk analisis ini.</div>;
  }
  // ------------------------------------------------

  return (
    <div className={`transition-colors duration-300 w-full p-6`}>
      {/* 1. Header & Kontrol Filter */}
      {/* (Catatan: Filter ini belum berfungsi, ini hanya UI) */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          {/* Judul ini bisa kita hapus/modifikasi karena sudah ada di layout induk */}
          <h1 className={`text-xl sm:text-2xl font-bold ${themed("text-slate-900", "text-white")}`}>Overview</h1>
        </div>
        <div className="flex flex-col items-stretch gap-2">
          <div className={`flex items-center gap-1.5 sm:gap-2 p-1 rounded-full ${themed("bg-slate-200", "bg-slate-900")} flex-shrink-0`}>
            <FilterButton value="7d" label="7 Hari" />
            <FilterButton value="30d" label="30 Hari" />
            <FilterButton value="custom" label="Rentang Kustom" />
            <FiCalendar className={`mx-1 sm:mx-2 ${themed("text-slate-500", "text-slate-400")}`} size={16} />
          </div>

          {customRangeActive && (
            <div className={`flex flex-col gap-2 rounded-2xl border px-3 py-2 text-xs ${themed("border-slate-200 bg-white", "border-slate-800 bg-slate-900/40")} sm:flex-row sm:items-center`}>
              <div className="flex flex-1 flex-col gap-1">
                <label htmlFor="start-date" className={themed("text-slate-600", "text-slate-400")}>
                  Tanggal Mulai
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={customRange.start}
                  onChange={(event) => setCustomRange((prev) => ({ ...prev, start: event.target.value }))}
                  className={`rounded-xl border px-3 py-2 text-sm ${themed("border-slate-200 bg-white text-slate-800", "border-slate-700 bg-slate-900 text-slate-100")}`}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label htmlFor="end-date" className={themed("text-slate-600", "text-slate-400")}>
                  Tanggal Selesai
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={customRange.end}
                  min={customRange.start || undefined}
                  onChange={(event) => setCustomRange((prev) => ({ ...prev, end: event.target.value }))}
                  className={`rounded-xl border px-3 py-2 text-sm ${themed("border-slate-200 bg-white text-slate-800", "border-slate-700 bg-slate-900 text-slate-100")}`}
                />
              </div>
              {customRangeHint && <p className="text-xs font-semibold text-amber-500">{customRangeHint}</p>}
            </div>
          )}
        </div>
      </header>

      {/* --- PERUBAHAN 5: Hubungkan ke Data Asli --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
        <KpiCard title="Total Event" value={overviewData.totalEvents.toLocaleString("id-ID")} icon={FiDatabase} isLoading={isLoading} tooltipText="Setiap baris data (tindakan) yang terekam dari log xAPI." href="#top-content-table" />
        <KpiCard title="Pengguna Aktif" value={overviewData.activeUsers.toLocaleString("id-ID")} icon={FiUsers} isLoading={isLoading} tooltipText="Jumlah unik 'actor' yang menghasilkan event dalam rentang waktu ini." />
        <KpiCard title="Konten Unik" value={overviewData.uniqueContents.toLocaleString("id-ID")} icon={FiList} isLoading={isLoading} tooltipText="Jumlah unik 'object' (konten/kuis/video) yang diakses." href="#top-content-table" />
        <KpiCard title="Tindakan Teratas" value={overviewData.topVerb} icon={FiCheckCircle} isLoading={isLoading} tooltipText="Kata kerja (verb) yang paling sering muncul di semua event." href="#top-verbs-chart" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        <div className="xl:col-span-2 min-w-0">
          {/* Kirim data JSON 'dailyActivity' yang sudah ada di 'overviewData' */}
          <ActivityChart data={filteredDailyActivity} isDark={isDark} isLoading={isLoading} />
        </div>
        <div className="xl:col-span-1 min-w-0">
          {/* Kirim data JSON 'topVerbs' */}
          <TopVerbsChart data={overviewData.topVerbs} isDark={isDark} isLoading={isLoading} />
        </div>
        <div className="xl:col-span-3 min-w-0">
          {/* Kirim data JSON 'topObjects' */}
          <TopContentTable data={overviewData.topObjects} isDark={isDark} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
