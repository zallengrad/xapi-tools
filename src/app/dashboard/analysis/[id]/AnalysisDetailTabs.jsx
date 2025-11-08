"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiLayout, FiShare2, FiFilter } from "react-icons/fi";

// Komponen ini menerima 'analysisId' agar tahu harus mengarah ke mana
export default function AnalysisDetailTabs({ analysisId }) {
  const pathname = usePathname();

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  const themed = (light, dark) => (isDark ? dark : light);

  const tabs = [
    { name: "Gambaran Umum", href: `/dashboard/analysis/${analysisId}/overview`, icon: FiLayout },
    { name: "Analisis LSA", href: `/dashboard/analysis/${analysisId}/lsa`, icon: FiShare2 },
    { name: "Analisis Funnel", href: `/dashboard/analysis/${analysisId}/funnel`, icon: FiFilter },
  ];

  return (
    <nav className={`flex items-center gap-2 border-b ${themed("border-slate-200", "border-slate-700")} px-6 ${themed("bg-white", "bg-slate-900/60")}`}>
      {tabs.map((tab) => {
        // Kita cek 'startsWith' karena pathname akan /.../lsa/[id]
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`
              flex items-center gap-2 px-3 py-3 text-sm font-semibold
              transition-colors
              ${
                isActive
                  ? themed("border-b-2 border-sky-500 text-sky-600", "border-b-2 border-sky-400 text-sky-300")
                  : themed("border-b-2 border-transparent text-slate-500 hover:text-slate-800", "border-b-2 border-transparent text-slate-400 hover:text-slate-100")
              }
            `}
          >
            <tab.icon size={16} />
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
