"use client";

import { useState, useEffect } from "react";
import { useThemeContext } from "@/context/theme/ThemeContext";
import { FiCalendar, FiTrendingUp, FiCheckCircle, FiUsers, FiActivity, FiBarChart2, FiList, FiDatabase } from "react-icons/fi";
import KpiCard from "./components/KpiCard";
import ActivityChart from "./components/ActivityChart";
import TopVerbsChart from "./components/TopVerbsChart";
import TopContentTable from "./components/TopContentTable";

// Impor data dummy (ganti ini dengan fetch API nanti)
import { dummyKpiData, dummyActivityData, dummyVerbsData, dummyObjectsData } from "@/lib/dummy-data"; // Asumsi Anda menyimpan di src/lib/

export default function OverviewPage() {
  const { isDark } = useThemeContext();
  const [filter, setFilter] = useState("7d"); // '7d', '30d', 'custom'

  // --- State untuk data ---
  // Kita gunakan data dummy sebagai nilai awal
  const [kpiData, setKpiData] = useState(dummyKpiData);
  const [activityData, setActivityData] = useState(dummyActivityData);
  const [verbsData, setVerbsData] = useState(dummyVerbsData);
  const [objectsData, setObjectsData] = useState(dummyObjectsData);
  const [isLoading, setIsLoading] = useState(false);

  // Helper untuk styling
  const themed = (light, dark) => (isDark ? dark : light);

  // --- Konsep: Pengambilan Data ---
  // useEffect ini akan "berpura-pura" mengambil data saat filter berubah
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // --- DI SINI ANDA AKAN MEMANGGIL API ANDA ---
      // const kpiRes = await fetch(`/api/kpi?range=${filter}`);
      // setKpiData(await kpiRes.json());
      //
      // const activityRes = await fetch(`/api/activity/daily?range=${filter}`);
      // setActivityData(await activityRes.json());
      // ... (dst untuk API lain)

      // Kita hanya simulasikan loading dengan data dummy
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi jeda jaringan

      // Muat ulang data dummy (dalam skenario nyata, data ini akan berbeda)
      setKpiData(dummyKpiData);
      setActivityData(dummyActivityData);
      setVerbsData(dummyVerbsData);
      setObjectsData(dummyObjectsData);

      setIsLoading(false);
    };

    fetchData();
  }, [filter]); // Dijalankan ulang setiap kali 'filter' berubah

  const FilterButton = ({ value, label }) => (
    <button
      onClick={() => setFilter(value)}
      className={`
        px-4 py-1.5 text-sm font-semibold rounded-full transition-colors
        ${filter === value ? "bg-sky-600 text-white" : themed("bg-white hover:bg-slate-50 text-slate-700", "bg-slate-800 hover:bg-slate-700 text-slate-200")}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className={`relative min-h-screen px-6 py-8 transition-colors duration-300 ${themed("bg-slate-100", "bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950")}`}>
      {/* 1. Header & Kontrol Filter */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${themed("text-slate-900", "text-white")}`}>Dasbor Gambaran Umum</h1>

          {/* --- BARIS BARU DITAMBAHKAN DI SINI --- */}
          <p className={`mt-2 text-sm font-semibold ${themed("text-sky-700", "text-sky-400")}`}>DevLens xAPI Analyzer - Beginner Dashboard</p>
          {/* --- AKHIR BARIS BARU --- */}
        </div>
        <div className={`flex items-center gap-2 p-1 rounded-full ${themed("bg-slate-200", "bg-slate-900")}`}>{/* ... (FilterButton tetap sama) ... */}</div>
      </header>

      {/* 2. Kartu KPI (Grid Responsif) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Event"
          value={kpiData.totalEvents.toLocaleString("id-ID")}
          icon={FiDatabase}
          isLoading={isLoading}
          tooltipText="Setiap baris data (tindakan) yang terekam dari log xAPI."
          href="/dashboard/analysis" // Arahkan ke halaman riwayat LSA
        />
        <KpiCard
          title="Pengguna Aktif"
          value={kpiData.activeUsers.toLocaleString("id-ID")}
          icon={FiUsers}
          isLoading={isLoading}
          tooltipText="Jumlah unik 'actor' yang menghasilkan event dalam rentang waktu ini."
          href="/dashboard/users" // (Contoh link - halaman ini belum ada)
        />
        <KpiCard
          title="Konten Unik"
          value={kpiData.uniqueContents.toLocaleString("id-ID")}
          icon={FiList}
          isLoading={isLoading}
          tooltipText="Jumlah unik 'object' (konten/kuis/video) yang diakses."
          href="#top-content-table" // Arahkan ke tabel di bawah
        />
        <KpiCard
          title="Tindakan Teratas"
          value={kpiData.topVerb}
          icon={FiCheckCircle}
          isLoading={isLoading}
          tooltipText="Kata kerja (verb) yang paling sering muncul di semua event."
          href="#top-verbs-chart" // Arahkan ke grafik di bawah
        />
      </section>

      {/* 3. Grid untuk Grafik & Tabel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Grafik Garis (2/3 Lebar diLayar Besar) */}
        <div className="lg:col-span-2">
          <ActivityChart data={activityData} isDark={isDark} isLoading={isLoading} />
        </div>

        {/* Grafik Batang (1/3 Lebar di Layar Besar) */}
        <div className="lg:col-span-1">
          <TopVerbsChart data={verbsData} isDark={isDark} isLoading={isLoading} />
        </div>

        {/* Tabel (Lebar Penuh) */}
        <div className="lg:col-span-3">
          <TopContentTable data={objectsData} isDark={isDark} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
