"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { FiTrendingDown } from "react-icons/fi";

const STAGE_LABELS = {
  initialized: "Initialized",
  experienced: "Experienced",
  progressed: "Progressed",
  completed: "Completed",
};

const toPercent = (value) => Number((value ?? 0) * 100).toFixed(1);

const createTooltipRenderer = (isDark) => {
  const containerClass = isDark ? "bg-slate-900/90 border-slate-700 text-slate-100" : "bg-white/90 border-slate-200 text-slate-900";
  return ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    if (!item) return null;
    return (
      <div className={`rounded-2xl border px-3 py-2 text-xs shadow-xl ${containerClass}`}>
        <p className="font-semibold">{item.stage}</p>
        <p className="mt-1">Sesi: {item.count.toLocaleString("id-ID")}</p>
        <p>Konversi: {item.conversion}%</p>
        <p>Drop-off: {item.dropOff}%</p>
      </div>
    );
  };
};

export default function FunnelConversionChart({ steps = [], isDark }) {
  const themed = (light, dark) => (isDark ? dark : light);

  const chartData = steps.map((step) => {
    const conversion = toPercent(step.rate);
    const dropOff = toPercent(step.dropOff);
    return {
      stage: STAGE_LABELS[step.stage] || step.stage,
      count: step.count ?? 0,
      conversion,
      dropOff,
      conversionLabel: `${conversion}%`,
    };
  });

  return (
    <section className={`rounded-3xl border p-6 shadow-sm transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${themed("text-slate-500", "text-slate-400")}`}>Analisis Funnel Pengguna</h3>
          <p className={`text-sm ${themed("text-slate-500", "text-slate-400")}`}>Menunjukkan jumlah sesi yang mencapai setiap tahap standar xAPI.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${themed("bg-sky-100 text-sky-700", "bg-sky-900/40 text-sky-200")}`}>Realtime Basis</span>
      </header>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 18, bottom: 8, left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={themed("#e2e8f0", "#1e293b")} />
            <XAxis type="number" stroke={themed("#94a3b8", "#475569")} />
            <YAxis type="category" dataKey="stage" width={110} stroke={themed("#94a3b8", "#cbd5f5")} />
            <Tooltip content={createTooltipRenderer(isDark)} cursor={{ fill: themed("rgba(56,189,248,0.08)", "rgba(14,165,233,0.12)") }} />
            <Bar dataKey="count" fill={themed("#0ea5e9", "#38bdf8")} radius={[0, 8, 8, 0]} maxBarSize={32}>
              <LabelList dataKey="conversionLabel" position="right" fill={themed("#0369a1", "#e0f2fe")} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        {chartData.map((item) => (
          <div key={item.stage} className={`flex items-center justify-between rounded-2xl px-4 py-2 ${themed("bg-slate-100 text-slate-700", "bg-slate-800/60 text-slate-200")}`}>
            <div>
              <p className="font-semibold">{item.stage}</p>
              <p className="text-xs">Konversi {item.conversion}%</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <FiTrendingDown className={item.dropOff === "0.0" ? "text-emerald-400" : "text-amber-400"} />
              Drop-off {item.dropOff}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
