"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts";
import { FiLoader } from "react-icons/fi";

export default function ActivityChart({ data, isDark, isLoading }) {
  const themed = (light, dark) => (isDark ? dark : light);
  const strokeColor = isDark ? "#38bdf8" : "#0284c7"; // sky-400 / sky-600
  const gridColor = isDark ? "#334155" : "#e2e8f0"; // slate-700 / slate-200
  const textColor = isDark ? "#cbd5e1" : "#475569"; // slate-300 / slate-600

  const ChartWrapper = ({ children }) => (
    <div className={`rounded-3xl border p-4 sm:p-5 lg:p-6 shadow-sm transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <h3 className={`text-base sm:text-lg font-semibold ${themed("text-slate-900", "text-white")}`}>Event per Hari</h3>
      <p className={`text-xs sm:text-sm mb-4 ${themed("text-slate-600", "text-slate-400")}`}>Tren aktivitas platform. (Drag di bawah untuk zoom)</p>
      <div className="h-64 sm:h-72 lg:h-80">{children}</div>
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
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={textColor} fontSize={11} />
          <YAxis stroke={textColor} fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: themed("rgba(255,255,255,0.95)", "rgba(30, 41, 59, 0.95)"),
              borderColor: gridColor,
              borderRadius: "12px",
              fontSize: "12px",
            }}
            labelStyle={{ color: themed("#1e293b", "#f1f5f9"), fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line type="monotone" dataKey="events" name="Jumlah Event" stroke={strokeColor} strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} />
          <Brush dataKey="date" height={30} stroke={strokeColor} fill={themed("rgba(241, 245, 249, 0.6)", "rgba(51, 65, 85, 0.6)")} tickFormatter={(index) => data[index]?.date.substring(5)} />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
