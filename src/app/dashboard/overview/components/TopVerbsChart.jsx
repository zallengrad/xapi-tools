"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FiLoader } from "react-icons/fi";

export default function TopVerbsChart({ data, isDark, isLoading }) {
  const themed = (light, dark) => (isDark ? dark : light);
  const fillColor = isDark ? "#38bdf8" : "#0284c7"; // sky-400 / sky-600
  const gridColor = isDark ? "#334155" : "#e2e8f0"; // slate-700 / slate-200
  const textColor = isDark ? "#cbd5e1" : "#475569"; // slate-300 / slate-600

  const ChartWrapper = ({ children }) => (
    <div className={`rounded-3xl border p-6 shadow-sm transition-colors h-96 ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <h3 className={`text-lg font-semibold ${themed("text-slate-900", "text-white")}`}>Tindakan Teratas</h3>
      <p className={`text-sm mb-6 ${themed("text-slate-600", "text-slate-400")}`}>10 'verbs' (kata kerja) paling sering.</p>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <ChartWrapper>
        <div className="flex items-center justify-center h-full w-full">
          <FiLoader className={`animate-spin ${themed("text-slate-400", "text-slate-500")}`} size={32} />
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.slice(0, 10)} // Ambil top 10
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis type="number" stroke={textColor} fontSize={12} />
          <YAxis
            type="category"
            dataKey="verb"
            stroke={textColor}
            fontSize={12}
            width={80} // Beri ruang untuk label
            interval={0} // Tampilkan semua label
          />
          <Tooltip
            contentStyle={{
              backgroundColor: themed("rgba(255,255,255,0.9)", "rgba(30, 41, 59, 0.9)"),
              borderColor: gridColor,
              borderRadius: "12px",
            }}
            labelStyle={{ color: themed("#1e293b", "#f1f5f9") }}
          />
          <Bar dataKey="count" name="Jumlah" fill={fillColor} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
