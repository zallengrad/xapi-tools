import { FiInfo, FiLoader } from "react-icons/fi";
import Link from "next/link"; // Impor Link dari Next.js

/**
 * Komponen Tooltip Sederhana (hanya CSS)
 * Kita buat terpisah agar rapi
 */
const Tooltip = ({ text }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg bg-slate-800 px-3 py-2 text-center text-xs text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-700 z-10">
    {text}
    <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
  </div>
);

export default function KpiCard({ title, value, icon: Icon, isLoading, tooltipText, href }) {
  const isDark = document.documentElement.classList.contains("dark");
  const themed = (light, dark) => (isDark ? dark : light);

  const cardContent = (
    <div
      className={`relative rounded-3xl border p-6 shadow-sm transition-all h-full
      ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}
      ${href ? themed("hover:shadow-md hover:border-sky-300", "hover:border-sky-500/60") : ""}
    `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-20">
          <FiLoader className={`animate-spin ${themed("text-slate-400", "text-slate-500")}`} size={24} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${themed("text-slate-600", "text-slate-400")}`}>{title}</span>

            {/* Tooltip Icon Wrapper (Grup untuk hover) */}
            <div className="relative flex items-center group">
              {tooltipText && (
                <>
                  <FiInfo className={themed("text-slate-400", "text-slate-500")} size={16} />
                  <Tooltip text={tooltipText} />
                </>
              )}

              {!tooltipText && Icon && <Icon className={themed("text-slate-400", "text-slate-500")} size={20} />}
            </div>
          </div>
          <p className={`mt-2 text-3xl font-bold ${themed("text-slate-900", "text-white")}`}>{value}</p>
        </>
      )}
    </div>
  );

  // Jika 'href' disediakan, bungkus kartu dengan Link
  if (href && !isLoading) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-3xl">
        {cardContent}
      </Link>
    );
  }

  // Jika tidak ada 'href', tampilkan div biasa
  return cardContent;
}
