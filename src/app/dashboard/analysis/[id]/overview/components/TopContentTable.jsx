"use client";

import { useState, useMemo } from "react";
import { FiLoader, FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function TopContentTable({ data, isDark, isLoading }) {
  const themed = (light, dark) => (isDark ? dark : light);

  // State untuk melacak konfigurasi sorting
  const [sortConfig, setSortConfig] = useState({ key: "count", direction: "desc" });

  // Gunakan useMemo untuk mengurutkan data
  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Fungsi untuk menangani klik pada header
  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // Komponen kecil untuk ikon sorting
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    if (sortConfig.direction === "asc") return <FiChevronUp size={14} className="ml-1" />;
    return <FiChevronDown size={14} className="ml-1" />;
  };

  const TableWrapper = ({ children }) => (
    <div className={`rounded-3xl border shadow-sm transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <div className="p-4 sm:p-5 lg:p-6">
        <h3 className={`text-base sm:text-lg font-semibold ${themed("text-slate-900", "text-white")}`}>Konten Terpopuler</h3>
        <p className={`text-xs sm:text-sm ${themed("text-slate-600", "text-slate-400")}`}>Daftar 25 'objects' (konten) yang paling sering diakses.</p>
      </div>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <TableWrapper>
        <div className="flex items-center justify-center h-40 w-full">
          <FiLoader className={`animate-spin ${themed("text-slate-400", "text-slate-500")}`} size={32} />
        </div>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-xs sm:text-sm">
          <thead className={themed("bg-slate-50", "bg-slate-800/50")}>
            <tr className="text-left">
              <th className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-semibold ${themed("text-slate-600", "text-slate-300")} w-12 sm:w-16`}>#</th>
              <th className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-semibold ${themed("text-slate-600", "text-slate-300")}`}>Nama Konten (Objek)</th>
              <th className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-semibold ${themed("text-slate-600", "text-slate-300")} hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap`} onClick={() => handleSort("count")}>
                <span className="flex items-center">
                  Jumlah Akses
                  <SortIcon columnKey="count" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className={themed("text-slate-800", "text-slate-200")}>
            {sortedData.slice(0, 25).map((item, index) => (
              <tr key={item.id} className={`${themed("border-b border-slate-200 hover:bg-slate-50", "border-b border-slate-800/50 hover:bg-slate-800/30")} transition-colors`}>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">{sortConfig.direction === "asc" ? data.length - index : index + 1}</td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 break-words max-w-xs lg:max-w-2xl" style={{ wordBreak: "break-word" }}>
                  {item.name}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-medium whitespace-nowrap">{item.count.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrapper>
  );
}
