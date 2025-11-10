"use client";

import { useThemeContext } from "@/context/theme/ThemeContext";
import ThemeToggle from "@/components/ui/ThemeToggle"; // Kita gunakan ThemeToggle yang sudah Anda buat
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { FiMenu } from "react-icons/fi";

import HelpButton from "@/components/ui/HelpButton";
import HelpModal from "@/components/ui/HelpModal";

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
  return "DevLens";
}

export default function Header({ onToggleSidebar = () => {} }) {
  const { isDark, toggle, ready } = useThemeContext();
  const pathname = usePathname();

  // Gunakan useMemo agar judul tidak dihitung ulang pada setiap render,
  // kecuali jika pathname berubah.
  const title = useMemo(() => getTitleFromPathname(pathname), [pathname]);
  const headerShell = isDark ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white/70";
  const titleClass = isDark ? "text-slate-100" : "text-slate-900";

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <header className={`sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur-sm transition-colors duration-300 ${headerShell}`}>
        {/* 1. Hamburger + Judul */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Buka navigasi"
            className={`rounded-md p-2 transition-colors lg:hidden ${isDark ? "text-slate-300 hover:bg-slate-800 hover:text-slate-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <h1 className={`text-lg font-semibold transition-colors ${titleClass}`}>{title}</h1>
        </div>

        {/* 2. Kontrol Sisi Kanan (Theme Toggle) */}
        <div className="flex items-center gap-4">
          {/* Kita gunakan ThemeToggle yang sudah ada dari src/components/ui/ThemeToggle.jsx */}
          {ready && <ThemeToggle isDark={isDark} onToggle={toggle} />}

          {/* help button */}
          <HelpButton onClick={() => setIsHelpModalOpen(true)} data-help-trigger />
        </div>
      </header>

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  );
}
