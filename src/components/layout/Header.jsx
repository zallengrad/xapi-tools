"use client";

import { useThemeContext } from "@/context/theme/ThemeContext";
import ThemeToggle from "@/components/ui/ThemeToggle"; // Kita gunakan ThemeToggle yang sudah Anda buat
import { usePathname } from "next/navigation";
import { useMemo } from "react";

// Fungsi helper untuk mengubah pathname menjadi judul yang rapi
function getTitleFromPathname(pathname) {
  if (pathname.startsWith("/analysis")) {
    return "Hasil Analisis";
  }
  if (pathname.startsWith("/convert")) {
    return "Upload Data xAPI";
  }
  // Tambahkan halaman lain di sini
  // if (pathname.startsWith("/dashboard")) {
  //   return "Dashboard Utama";
  // }
  // Judul default
}

export default function Header() {
  const { isDark, toggle, ready } = useThemeContext();
  const pathname = usePathname();

  // Gunakan useMemo agar judul tidak dihitung ulang pada setiap render,
  // kecuali jika pathname berubah.
  const title = useMemo(() => getTitleFromPathname(pathname), [pathname]);
  const headerShell = isDark ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white/70";
  const titleClass = isDark ? "text-slate-100" : "text-slate-900";

  return (
    <header className={`sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur-sm transition-colors duration-300 ${headerShell}`}>
      {/* 1. Judul Halaman (Dinamis berdasarkan URL) */}
      <div>
        <h1 className={`text-lg font-semibold transition-colors ${titleClass}`}>{title}</h1>
      </div>

      {/* 2. Kontrol Sisi Kanan (Theme Toggle) */}
      <div className="flex items-center gap-4">
        {/* Kita gunakan ThemeToggle yang sudah ada dari src/components/ui/ThemeToggle.jsx */}
        {ready && <ThemeToggle isDark={isDark} onToggle={toggle} />}

        {/* Placeholder untuk info user ringkas (jika diperlukan di header) */}
        {/* <span className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></span> */}
      </div>
    </header>
  );
}
