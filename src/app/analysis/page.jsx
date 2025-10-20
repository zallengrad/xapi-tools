// Karena kita akan menggunakan state (useState) dan event (onClick) untuk toggle tema,
// kita perlu mendeklarasikan komponen ini sebagai "Client Component" di Next.js App Router.
"use client";

import { useState } from "react";

// === Ikon SVG untuk Tombol Tema ===
// Ikon ini bisa Anda pindahkan ke file terpisah nanti jika mau.
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// === Komponen Placeholder untuk Kartu Statistik ===
// Ini membantu membuat kode utama lebih bersih.
const StatCard = ({ title, value, change }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="mt-1 text-sm text-green-500">{change}</p>
  </div>
);

// === Komponen Utama Halaman Dashboard ===
export default function DashboardPage() {
  // State untuk mengelola tema (terang atau gelap)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fungsi untuk mengubah tema
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Logika className: Jika isDarkMode true, class 'dark' akan ditambahkan ke div utama.
  // Tailwind CSS akan otomatis menerapkan style dark:.. pada semua elemen di dalamnya.
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* === 1. Header Halaman === */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard DevLens</h1>
              <p className="text-gray-500 dark:text-gray-400">Melihat Lebih Dekat Pola Pengerjaan Kode Anda.</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </header>

          {/* === 2. Kartu Statistik Utama (KPIs) === */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Data di sini masih statis, nantinya akan diisi dari API */}
            <StatCard title="Total Proyek Dikerjakan" value="12" change="+2 minggu ini" />
            <StatCard title="Rata-rata Error per Jam" value="3.4" change="-0.5 dari kemarin" />
            <StatCard title="Waktu Aktif Coding (Jam)" value="28" change="+5 jam minggu ini" />
            <StatCard title="Rata-rata Time-to-Fix" value="8m 15s" change="-1m dari rata-rata" />
          </section>

          {/* === 3. Visualisasi Utama & Sekunder === */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri - Chart Utama */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analisis Frekuensi Error per Soal</h3>
              <div className="h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">[Placeholder untuk Komponen Grafik Batang]</p>
                {/* Di sini Anda akan meletakkan komponen dari library seperti Chart.js atau Recharts */}
                {/* Contoh: <ErrorBarChart data={...} /> */}
              </div>
            </div>

            {/* Kolom Kanan - Info Tambahan */}
            <div className="flex flex-col gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pola Debugging Terdeteksi</h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <p>Siklus Run-Error berulang terdeteksi pada **Soal #5**.</p>
                  <p className="text-indigo-500 dark:text-indigo-400 font-semibold">Saran: Coba metode Rubber Duck Debugging.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aktivitas Terbaru</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold mr-3 px-2.5 py-0.5 rounded-full">SUCCESS</span>
                    <span>Submit Soal #8: Multiple Methods</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-bold mr-3 px-2.5 py-0.5 rounded-full">ERROR</span>
                    <span>Run code `Main.java` di Soal #9</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
