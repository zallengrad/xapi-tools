"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush, // 1. Impor Brush
} from "recharts";
import { FiLoader } from "react-icons/fi";

export default function ActivityChart({ data, isDark, isLoading }) {
  const themed = (light, dark) => (isDark ? dark : light);
  const strokeColor = isDark ? "#38bdf8" : "#0284c7"; // sky-400 / sky-600
  const gridColor = isDark ? "#334155" : "#e2e8f0"; // slate-700 / slate-200
  const textColor = isDark ? "#cbd5e1" : "#475569"; // slate-300 / slate-600

  // ... (Komponen ChartWrapper tetap sama) ...
  const ChartWrapper = ({ children }) => (
    <div className={`rounded-3xl border p-6 shadow-sm transition-colors h-96 ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <h3 className={`text-lg font-semibold ${themed("text-slate-900", "text-white")}`}>Event per Hari</h3>
      <p className={`text-sm mb-6 ${themed("text-slate-600", "text-slate-400")}`}>Tren aktivitas platform. (Drag di bawah untuk zoom)</p>
      {children}
    </div>
  );
  // ... (Logika isLoading tetap sama) ...

  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={textColor} fontSize={12} />
          <YAxis stroke={textColor} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: themed("rgba(255,255,255,0.9)", "rgba(30, 41, 59, 0.9)"),
              borderColor: gridColor,
              borderRadius: "12px",
            }}
            labelStyle={{ color: themed("#1e293b", "#f1f5f9") }}
          />
          <Legend />
          <Line type="monotone" dataKey="events" name="Jumlah Event" stroke={strokeColor} strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }} />

          {/* 2. Tambahkan Brush di sini */}
          <Brush
            dataKey="date"
            height={30}
            stroke={strokeColor}
            fill={themed("rgba(241, 245, 249, 0.6)", "rgba(51, 65, 85, 0.6)")} // slate-100 / slate-700
            tickFormatter={(index) => data[index]?.date.substring(5)} // Tampilkan format MM-DD
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
