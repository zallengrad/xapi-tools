"use client";

import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";

export default function AnalysisActionModal({
  isOpen,
  isDark,
  analysis,
  renameValue,
  onRenameChange,
  onRename,
  onDelete,
  onClose,
  isRenaming = false,
  isDeleting = false,
  errorMessage = "",
}) {
  if (!isOpen || !analysis) {
    return null;
  }

  const isBusy = isRenaming || isDeleting;
  const backdrop = "fixed inset-0 z-50 flex items-center justify-center px-4";
  const baseCard = "w-full max-w-lg rounded-3xl border p-6 shadow-2xl transition-colors duration-300";
  const cardClass = isDark ? `${baseCard} border-slate-800 bg-slate-900 text-slate-100` : `${baseCard} border-slate-200 bg-white text-slate-900`;
  const labelClass = isDark ? "text-slate-300" : "text-slate-600";
  const inputClass = isDark
    ? "w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
    : "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none";

  return (
    <div className={`${backdrop} bg-black/60 backdrop-blur-sm`}>
      <div className={cardClass} role="dialog" aria-modal="true" aria-labelledby="analysis-action-title">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">Kelola Analisis</p>
            <h2 id="analysis-action-title" className="mt-2 text-2xl font-bold">
              {analysis.sourceFile || "Tanpa Judul"}
            </h2>
            <p className={`mt-1 text-sm ${labelClass}`}>Perbarui nama tampilan atau hapus hasil analisis ini.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className={`rounded-full p-2 ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"} ${isBusy ? "opacity-40" : ""}`}
            aria-label="Tutup modal"
          >
            <FiX className="h-5 w-5" />
          </button>
        </header>

        <section className="mt-6 space-y-3 rounded-2xl border px-4 py-5" aria-labelledby="rename-section-title">
          <header className="flex items-center gap-3">
            <span className={`rounded-2xl p-2 ${isDark ? "bg-sky-500/20 text-sky-100" : "bg-sky-500/10 text-sky-600"}`}>
              <FiEdit3 className="h-5 w-5" />
            </span>
            <div>
              <p id="rename-section-title" className="text-sm font-semibold">
                Ubah Nama Berkas
              </p>
              <p className={`text-xs ${labelClass}`}>Nama ini akan tampil di sidebar dan tabel analisis.</p>
            </div>
          </header>

          <div className="space-y-3">
            <input type="text" value={renameValue} onChange={(event) => onRenameChange(event.target.value)} placeholder="Masukkan nama baru..." className={inputClass} />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onRename}
                disabled={isRenaming || !renameValue.trim()}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${
                  isRenaming ? "bg-sky-400" : "bg-sky-600 hover:bg-sky-500"
                }`}
              >
                {isRenaming ? "Menyimpan..." : "Simpan Nama"}
              </button>
              <button type="button" onClick={onClose} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Batal
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-3 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-5" aria-labelledby="delete-section-title">
          <header className="flex items-center gap-3">
            <span className="rounded-2xl bg-red-500/20 p-2 text-red-500">
              <FiTrash2 className="h-5 w-5" />
            </span>
            <div>
              <p id="delete-section-title" className="text-sm font-semibold text-red-500">
                Hapus Analisis
              </p>
              <p className={`text-xs ${isDark ? "text-red-200" : "text-red-600"}`}>Tindakan ini akan menghapus semua data terkait secara permanen.</p>
            </div>
          </header>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition ${
              isDeleting ? "cursor-wait bg-red-400" : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {isDeleting ? "Menghapus..." : "Hapus Analisis"}
          </button>
        </section>

        {errorMessage && (
          <p className="mt-4 text-sm font-semibold text-red-500" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
