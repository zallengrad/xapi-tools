"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
// Kita tidak perlu 'useThemeContext' di sini lagi,
// karena Root Layout akan menanganinya.

export default function DashboardLayout({ children }) {
  // Kita HAPUS tag <html>, <body>, dan logika themeClass
  // Komponen ini sekarang HANYA FOKUS pada tata letak flexbox.
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col pl-64">
        <Header />

        <main className="flex-1 p-6">
          {children} {/* Di sinilah page.jsx Anda akan dirender */}
        </main>
      </div>
    </div>
  );
}
