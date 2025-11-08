"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const createTooltipRenderer = (isDark) => {
  const theme = isDark ? "bg-slate-900/90 border-slate-700 text-slate-100" : "bg-white/95 border-slate-200 text-slate-900";
  return ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    if (!item) return null;
    return (
      <div className={`rounded-2xl border px-3 py-2 text-xs shadow-lg ${theme}`}>
        <p className="font-semibold">Durasi {item.range}</p>
        <p>{item.count.toLocaleString("id-ID")} sesi</p>
      </div>
    );
  };
};

export default function SessionDurationHistogram({ histogram = [], isDark }) {
  const themed = (light, dark) => (isDark ? dark : light);
  const chartData = histogram.map((bucket) => ({
    range: bucket.range,
    count: bucket.count ?? 0,
  }));

  const totalSessions = chartData.reduce((sum, bucket) => sum + bucket.count, 0);

  return (
    <section className={`rounded-3xl border p-6 shadow-sm transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
      <header className="mb-4">
        <h3 className={`text-lg font-semibold ${themed("text-slate-500", "text-slate-400")}`}>Distribusi Durasi Sesi</h3>
        <p className={`text-sm ${themed("text-slate-500", "text-slate-400")}`}>Membandingkan jumlah sesi pada rentang durasi tertentu.</p>
      </header>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={themed("#e2e8f0", "#1e293b")} />
            <XAxis dataKey="range" stroke={themed("#94a3b8", "#475569")} angle={-15} dy={16} />
            <YAxis allowDecimals={false} stroke={themed("#94a3b8", "#475569")} />
            <Tooltip content={createTooltipRenderer(isDark)} cursor={{ fill: themed("rgba(99,102,241,0.08)", "rgba(129,140,248,0.12)") }} />
            <Bar dataKey="count" fill={themed("#6366f1", "#818cf8")} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className={`mt-4 text-xs ${themed("text-slate-500", "text-slate-400")}`}>Total sesi yang dianalisis: {totalSessions.toLocaleString("id-ID")}.</p>
    </section>
  );
}
