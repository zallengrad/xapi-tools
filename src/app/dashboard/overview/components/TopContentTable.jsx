"use client";

import { useState, useMemo } from "react"; // 1. Impor useState dan useMemo
import { FiLoader, FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function TopContentTable({ data, isDark, isLoading }) {
  const themed = (light, dark) => (isDark ? dark : light);

  // 2. State untuk melacak konfigurasi sorting
  const [sortConfig, setSortConfig] = useState({ key: "count", direction: "desc" });

  // 3. Gunakan useMemo untuk mengurutkan data
  // Ini hanya akan berjalan ulang jika 'data' atau 'sortConfig' berubah
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

  // 4. Fungsi untuk menangani klik pada header
  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // 5. Komponen kecil untuk ikon sorting
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    if (sortConfig.direction === "asc") return <FiChevronUp size={14} className="ml-1" />;
    return <FiChevronDown size={14} className="ml-1" />;
  };

  // ... (Komponen TableWrapper tetap sama) ...
  const TableWrapper = ({ children }) => (
    <div className={`rounded-3xl border shadow-sm transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <div className="p-6">
        <h3 className={`text-lg font-semibold ${themed("text-slate-900", "text-white")}`}>Konten Terpopuler</h3>
        <p className={`text-sm ${themed("text-slate-600", "text-slate-400")}`}>Daftar 25 'objects' (konten) yang paling sering diakses.</p>
      </div>
      {children}
    </div>
  );
  // ... (Logika isLoading tetap sama) ...

  return (
    <TableWrapper>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className={themed("bg-slate-50", "bg-slate-800/50")}>
            <tr className="text-left">
              <th className={`px-6 py-3 font-semibold ${themed("text-slate-600", "text-slate-300")}`}>#</th>
              <th className={`px-6 py-3 font-semibold ${themed("text-slate-600", "text-slate-300")}`}>
                {/* 6. Buat header bisa diklik (jika ingin bisa disort) */}
                Nama Konten (Objek)
              </th>
              <th
                className={`px-6 py-3 font-semibold ${themed("text-slate-600", "text-slate-300")} hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer`}
                onClick={() => handleSort("count")} // 6. Tambahkan onClick
              >
                <span className="flex items-center">
                  Jumlah Akses
                  <SortIcon columnKey="count" /> {/* 6. Tampilkan ikon */}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className={themed("text-slate-800", "text-slate-200")}>
            {/* 7. Gunakan 'sortedData' bukan 'data' */}
            {sortedData.slice(0, 25).map((item, index) => (
              <tr key={item.id} className={themed("border-b border-slate-200", "border-b border-slate-800/50")}>
                <td className="px-6 py-3 w-16">
                  {/* Tampilkan peringkat berdasarkan sorting */}
                  {sortConfig.direction === "asc" ? data.length - index : index + 1}
                </td>
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3 w-48 font-medium">{item.count.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrapper>
  );
}
