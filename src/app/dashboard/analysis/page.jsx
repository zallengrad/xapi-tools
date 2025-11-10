"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useThemeContext } from "../../../context/theme/ThemeContext";
// Perhatikan: Pastikan path impor ini benar setelah Anda memindahkan file
import AnalysisHistory from "./components/AnalysisHistory";
import { FiBarChart2, FiClock, FiEdit3, FiEye, FiFileText, FiLayers, FiRefreshCcw, FiTrash2 } from "react-icons/fi";
import { DeleteAnalysisModal, RenameAnalysisModal } from "./components/AnalysisActionModal";

export default function AnalysisOverviewPage() {
  const { isDark } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameModal, setRenameModal] = useState({ open: false, loading: false, error: "" });
  const [deleteModal, setDeleteModal] = useState({ open: false, loading: false, error: "" });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadResults = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analysis");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sesi kedaluwarsa. Silakan login ulang.");
        }

        const { error: message } = await response.json().catch(() => ({}));
        throw new Error(message || "Gagal mengambil daftar analisis.");
      }

      const data = await response.json();
      if (!mountedRef.current) return;
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      if (!mountedRef.current) return;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const openRenameModal = (analysis) => {
    setSelectedAnalysis(analysis);
    setRenameValue(analysis?.sourceFile || "");
    setRenameModal({ open: true, loading: false, error: "" });
    setDeleteModal({ open: false, loading: false, error: "" });
  };

  const closeRenameModal = () => {
    if (renameModal.loading) return;
    setRenameModal({ open: false, loading: false, error: "" });
    setRenameValue("");
    setSelectedAnalysis(null);
  };

  const openDeleteModal = (analysis) => {
    setSelectedAnalysis(analysis);
    setDeleteModal({ open: true, loading: false, error: "" });
    setRenameModal({ open: false, loading: false, error: "" });
  };

  const closeDeleteModal = () => {
    if (deleteModal.loading) return;
    setDeleteModal({ open: false, loading: false, error: "" });
    setSelectedAnalysis(null);
  };

  const handleRename = async () => {
    if (!selectedAnalysis) return;
    const nextName = renameValue.trim();
    if (!nextName) {
      setRenameModal((prev) => ({ ...prev, error: "Nama file tidak boleh kosong." }));
      return;
    }

    setRenameModal((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const response = await fetch(`/api/analysis/${selectedAnalysis.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceFile: nextName }),
      });

      if (!response.ok) {
        const { error: message } = await response.json().catch(() => ({}));
        throw new Error(message || "Gagal memperbarui nama analisis.");
      }

      await loadResults();
      setRenameModal({ open: false, loading: false, error: "" });
      setRenameValue("");
      setSelectedAnalysis(null);
    } catch (err) {
      setRenameModal((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Terjadi kesalahan.",
      }));
    }
  };

  const handleDelete = async () => {
    if (!selectedAnalysis) return;
    setDeleteModal((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const response = await fetch(`/api/analysis/${selectedAnalysis.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const { error: message } = await response.json().catch(() => ({}));
        throw new Error(message || "Gagal menghapus analisis.");
      }

      await loadResults();
      setDeleteModal({ open: false, loading: false, error: "" });
      setSelectedAnalysis(null);
    } catch (err) {
      setDeleteModal((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Terjadi kesalahan.",
      }));
    }
  };

  const summary = useMemo(() => {
    if (!results.length) {
      return {
        total: 0,
        lastGeneratedAt: null,
        totalEvents: 0,
      };
    }

    const total = results.length;
    const totalEvents = results.reduce((sum, item) => sum + (item.recordCount ?? 0), 0);
    const lastGeneratedAt = results[0]?.generatedAt ? new Date(results[0].generatedAt) : null;

    return { total, lastGeneratedAt, totalEvents };
  }, [results]);

  const historyItems = useMemo(() => {
    return results.slice(0, 10).map((item) => {
      const payload = item?.payload && typeof item.payload === "object" ? item.payload : {};
      const transitions = Array.isArray(payload?.significantTransitions) ? payload.significantTransitions : [];

      return {
        id: item.id,
        title: item.sourceFile || "Tanpa Judul",
        // --- PERUBAHAN DI SINI ---
        href: `/dashboard/analysis/${item.id}/overview`, // Arahkan ke tab overview
        // -------------------------
        description: transitions.length
          ? `Transisi signifikan: ${transitions
              .slice(0, 2)
              .map((transition) => `${transition.from}->${transition.to}`)
              .join(", ")}`
          : "Belum ada transisi signifikan yang tercatat.",
        createdAt: item.generatedAt ? new Date(item.generatedAt).toLocaleString("id-ID") : "-",
        recordCount: item.recordCount ?? 0,
        cohort: item.createdAt ? `Disimpan ${new Date(item.createdAt).toLocaleString("id-ID")}` : null,
        tag: transitions.length ? "Signifikan" : "Umum",
      };
    });
  }, [results]);

  const emptyState = !isLoading && !results.length;

  const themed = (light, dark) => (isDark ? dark : light);

  return (
    <div className={`relative min-h-screen px-6 py-8 transition-colors duration-300 ${themed("bg-slate-100 text-slate-900", "bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950 text-slate-100")}`}>
      <div className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-300 ${themed("bg-transparent", "bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.08)_0,_rgba(0,0,0,0)_60%)]")}`} />

      <div className="container mx-auto px-2 sm:px-4">
        <header className="mx-auto flex max-w-8xl flex-col items-start justify-between gap-4 pb-8 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-3xl font-bold">Riwayat Analisis LSA</h1>
            <p className={`mt-2 text-sm ${themed("text-slate-600", "text-slate-400")}`}>Pantau semua file xAPI yang telah Anda konversi dan analisis. Klik salah satu hasil untuk melihat detail lengkapnya.</p>
          </div>

          <Link
            href="/dashboard/convert" //
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${themed("bg-sky-600 text-white hover:bg-sky-500", "bg-sky-500/90 text-white hover:bg-sky-400")}`}
          >
            <FiRefreshCcw />
            Jalankan Analisis Baru
          </Link>
        </header>

        <section className="mx-auto grid max-w-8xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className={`rounded-3xl border p-5 transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
            <header className="flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${themed("bg-sky-500/10 text-sky-600", "bg-sky-500/20 text-sky-200")}`}>
                <FiLayers size={20} />
              </span>
              <div>
                <p className={`text-xs font-medium uppercase tracking-[0.2em] ${themed("text-slate-500", "text-slate-400")}`}>Total Analisis</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
            </header>
          </article>

          <article className={`rounded-3xl border p-5 transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
            <header className="flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${themed("bg-emerald-500/10 text-emerald-600", "bg-emerald-500/20 text-emerald-200")}`}>
                <FiFileText size={20} />
              </span>
              <div>
                <p className={`text-xs font-medium uppercase tracking-[0.2em] ${themed("text-slate-500", "text-slate-400")}`}>Total Kejadian</p>
                <p className="text-2xl font-bold">{summary.totalEvents.toLocaleString("id-ID")}</p>
              </div>
            </header>
          </article>

          <article className={`rounded-3xl border p-5 transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
            <header className="flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${themed("bg-amber-500/10 text-amber-600", "bg-amber-500/20 text-amber-200")}`}>
                <FiClock size={20} />
              </span>
              <div>
                <p className={`text-xs font-medium uppercase tracking-[0.2em] ${themed("text-slate-500", "text-slate-400")}`}>Terbaru</p>
                <p className="text-sm font-semibold">{summary.lastGeneratedAt ? summary.lastGeneratedAt.toLocaleString("id-ID") : "Belum ada analisis"}</p>
              </div>
            </header>
          </article>
        </section>

        <div className="mx-auto mt-10 grid max-w-8xl gap-8 lg:grid-cols-[minmax(0,320px),minmax(0,1fr)]">
          {/* <AnalysisHistory title="Riwayat Terakhir" subtitle={results.length ? "10 analisis terbaru Anda." : "Analisis yang sudah berjalan akan muncul di sini."} items={historyItems} isDark={isDark} /> */}

          <section className={`min-h-[260px] overflow-hidden rounded-3xl border transition-colors ${themed("border-slate-200 bg-white", "border-slate-800/70 bg-slate-900/60")}`}>
            <header className="flex items-center justify-between border-b px-6 py-4 transition-colors">
              <div>
                <h2 className="text-lg font-semibold">Semua Analisis</h2>
                <p className={`text-xs ${themed("text-slate-500", "text-slate-400")}`}>Klik salah satu baris untuk melihat detail.</p>
              </div>
              <FiBarChart2 className={themed("text-slate-400", "text-slate-500")} />
            </header>

            {isLoading ? (
              <div className={`flex items-center justify-center px-6 py-10 text-sm ${themed("text-slate-500", "text-slate-300")}`}>Memuat data analisis...</div>
            ) : error ? (
              <div className={`px-6 py-10 text-center text-sm font-semibold ${themed("text-red-600", "text-red-300")}`}>{error}</div>
            ) : emptyState ? (
              <div className={`px-6 py-10 text-center text-sm ${themed("text-slate-500", "text-slate-400")}`}>Belum ada hasil analisis. Jalankan konversi pertama Anda di halaman Convert.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead className={themed("bg-slate-100", "bg-slate-800/50")}>
                    <tr className="text-left">
                      <th className="px-6 py-3 font-semibold">Nama Berkas</th>
                      <th className="px-6 py-3 font-semibold">Tanggal Dibuat</th>
                      <th className="px-6 py-3 font-semibold">Jumlah Kejadian</th>
                      <th className="px-6 py-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item) => (
                      <tr key={item.id} className={themed("border-b border-slate-200 hover:bg-slate-50", "border-b border-slate-800/50 hover:bg-slate-800/40")}>
                        <td className="max-w-xs px-6 py-3">
                          <Link
                            href={`/dashboard/analysis/${item.id}/overview`}
                            className={`line-clamp-1 font-semibold transition-colors ${themed("text-slate-700 hover:text-sky-600", "text-slate-200 hover:text-sky-300")}`}
                            title="Lihat detail analisis"
                          >
                            {item.sourceFile || "Tanpa Judul"}
                          </Link>
                        </td>
                        <td className="px-6 py-3">{item.generatedAt ? new Date(item.generatedAt).toLocaleString("id-ID") : "-"}</td>
                        <td className="px-6 py-3">{(item.recordCount ?? 0).toLocaleString("id-ID")}</td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/dashboard/analysis/${item.id}/overview`}
                              className={`inline-flex items-center justify-center rounded-full p-2 text-base transition ${themed(
                                "text-slate-500 hover:text-sky-600 hover:bg-slate-100",
                                "text-slate-300 hover:text-sky-200 hover:bg-slate-800/50"
                              )}`}
                              title="Lihat Detail"
                              aria-label="Lihat detail analisis"
                            >
                              <FiEye className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openRenameModal(item)}
                              className={`inline-flex items-center justify-center rounded-full p-2 text-base transition ${themed(
                                "text-amber-600 hover:bg-amber-50",
                                "text-amber-300 hover:bg-amber-500/20"
                              )}`}
                              title="Ubah Nama Analisis"
                              aria-label="Ubah nama analisis"
                            >
                              <FiEdit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeleteModal(item)}
                              className={`inline-flex items-center justify-center rounded-full p-2 text-base transition ${themed(
                                "text-red-600 hover:bg-red-50",
                                "text-red-300 hover:bg-red-500/20"
                              )}`}
                              title="Hapus Analisis"
                              aria-label="Hapus analisis"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      <RenameAnalysisModal
        isOpen={renameModal.open}
        isDark={isDark}
        analysis={selectedAnalysis}
        renameValue={renameValue}
        onRenameChange={setRenameValue}
        onSubmit={handleRename}
        onClose={closeRenameModal}
        isLoading={renameModal.loading}
        errorMessage={renameModal.error}
      />

      <DeleteAnalysisModal
        isOpen={deleteModal.open}
        isDark={isDark}
        analysis={selectedAnalysis}
        onConfirm={handleDelete}
        onClose={closeDeleteModal}
        isLoading={deleteModal.loading}
        errorMessage={deleteModal.error}
      />
    </div>
  );
}
