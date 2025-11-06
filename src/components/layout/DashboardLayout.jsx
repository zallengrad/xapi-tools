"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useThemeContext } from "@/context/theme/ThemeContext";

export default function DashboardLayout({ children }) {
  const { isDark } = useThemeContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 1024 : false));

  // Pastikan sidebar terbuka secara default pada layar besar
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => setIsSidebarOpen(event.matches);

    handleChange(mediaQuery);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const shellClass = isDark ? "bg-slate-950" : "bg-slate-100";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${shellClass}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay untuk layar kecil */}
      {isSidebarOpen && <button type="button" aria-label="Tutup navigasi" onClick={closeSidebar} className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition lg:hidden" />}

      <div className="flex flex-1 flex-col lg:pl-64">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 transition-colors duration-300 ">{children}</main>
      </div>
    </div>
  );
}
