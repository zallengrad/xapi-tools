"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useThemeContext } from "@/context/theme/ThemeContext";

export default function DashboardLayout({ children }) {
  const { isDark } = useThemeContext();

  const shellClass = isDark ? "bg-slate-950" : "bg-slate-100";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${shellClass}`}>
      <Sidebar />

      <div className="flex flex-1 flex-col pl-64">
        <Header />

        <main className="flex-1 p-6 transition-colors duration-300">{children}</main>
      </div>
    </div>
  );
}
