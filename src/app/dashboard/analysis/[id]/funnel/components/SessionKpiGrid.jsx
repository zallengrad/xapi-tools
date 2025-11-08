"use client";

import { FiClock, FiUsers, FiActivity } from "react-icons/fi";

const formatNumber = (value, options = {}) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    ...options,
  });
  return formatter.format(Number.isFinite(value) ? value : 0);
};

export default function SessionKpiGrid({ data, isDark }) {
  const themed = (light, dark) => (isDark ? dark : light);

  const cards = [
    {
      title: "Durasi Sesi Rata-rata",
      value: `${formatNumber(data?.avgSessionDuration ?? 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`,
      caption: "Hitungan menit dari semua sesi",
      icon: FiClock,
    },
    {
      title: "Total Sesi",
      value: formatNumber(data?.totalSessions ?? 0, { maximumFractionDigits: 0 }),
      caption: "Digabung dari seluruh pengguna",
      icon: FiUsers,
    },
    {
      title: "Rata-rata Event/Sesi",
      value: formatNumber(data?.avgEventsPerSession ?? 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      caption: "Interaksi per sesi",
      icon: FiActivity,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {cards.map((card) => (
        <article key={card.title} className={`rounded-3xl border px-6 py-5 shadow-sm transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
          <div className="flex items-start gap-4">
            <div className={`rounded-2xl p-3 text-lg ${themed("bg-slate-100 text-slate-700", "bg-slate-800/80 text-slate-200")}`}>
              <card.icon />
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${themed("text-slate-500", "text-slate-400")}`}>{card.title}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
              <p className={`text-xs ${themed("text-slate-500", "text-slate-400")}`}>{card.caption}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
