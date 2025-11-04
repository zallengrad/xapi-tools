"use client";

import { FiBarChart2, FiClock, FiFileText, FiHash, FiUsers } from "react-icons/fi";

function HistoryItem({ title, description, createdAt, recordCount, cohort, tag, isDark }) {
  const itemShell = isDark ? "border-slate-800 bg-slate-900/40 hover:border-sky-500/40 hover:bg-slate-900/60" : "border-slate-200 bg-white hover:border-sky-400/60 hover:bg-slate-50";

  const metaText = isDark ? "text-slate-400" : "text-slate-500";
  const accent = isDark ? "text-sky-300" : "text-sky-600";

  return (
    <article className={`group rounded-2xl border p-4 transition-colors duration-300 ${itemShell}`}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-sm font-semibold transition-colors ${isDark ? "text-slate-100" : "text-slate-800"}`}>{title}</h3>
          {description ? <p className={`mt-1 text-xs leading-relaxed ${isDark ? "text-slate-300/80" : "text-slate-600"}`}>{description}</p> : null}
        </div>
        {tag ? (
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
            <FiHash />
            {tag}
          </span>
        ) : null}
      </header>

      <dl className={`mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 ${metaText}`}>
        <div className="flex items-center gap-2">
          <FiClock className={accent} />
          <div>
            <dt className="font-medium uppercase tracking-[0.2em] opacity-75">Dibuat</dt>
            <dd className="mt-0.5">{createdAt}</dd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FiFileText className={accent} />
          <div>
            <dt className="font-medium uppercase tracking-[0.2em] opacity-75">Jumlah Baris</dt>
            <dd className="mt-0.5">{recordCount} kejadian</dd>
          </div>
        </div>

        {cohort ? (
          <div className="flex items-center gap-2 sm:col-span-2">
            <FiUsers className={accent} />
            <div>
              <dt className="font-medium uppercase tracking-[0.2em] opacity-75">Kelompok</dt>
              <dd className="mt-0.5">{cohort}</dd>
            </div>
          </div>
        ) : null}
      </dl>
    </article>
  );
}

export default function AnalysisHistory({ title, subtitle, items, isDark }) {
  const shell = isDark ? "border-slate-800/80 bg-slate-900/50" : "border-slate-200 bg-white";

  const iconWrapper = isDark ? "bg-sky-500/10 text-sky-300" : "bg-sky-500/10 text-sky-600";
  const titleColor = isDark ? "text-slate-100" : "text-slate-800";
  const subtitleColor = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <section className={`rounded-3xl border p-6 shadow-sm transition-colors duration-300 ${shell}`}>
      <header className="flex items-start gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrapper}`}>
          <FiBarChart2 size={22} />
        </span>
        <div>
          <h2 className={`text-lg font-semibold transition-colors ${titleColor}`}>{title}</h2>
          {subtitle ? <p className={`mt-1 text-sm ${subtitleColor}`}>{subtitle}</p> : null}
        </div>
      </header>

      <div className="mt-5 grid gap-3">
        {items?.map((item) => (
          <HistoryItem key={item.id} {...item} isDark={isDark} />
        ))}
      </div>
    </section>
  );
}
