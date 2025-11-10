"use client";

import { FiEdit3, FiTrash2, FiX } from "react-icons/fi";

const backdropClass = "fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm";
const cardBase = "w-full max-w-lg rounded-3xl border p-6 shadow-2xl transition-colors duration-300";

const srOnly = "sr-only";

function ModalShell({ isOpen, isDark, titleId, title, subtitle, onClose, disabled, children }) {
  if (!isOpen) {
    return null;
  }

  const cardClass = isDark ? `${cardBase} border-slate-800 bg-slate-900 text-slate-100` : `${cardBase} border-slate-200 bg-white text-slate-900`;
  const closeClass = isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100";

  return (
    <div className={backdropClass}>
      <div className={cardClass} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">{subtitle}</p>
            <h2 id={titleId} className="mt-2 text-2xl font-bold">
              {title}
            </h2>
          </div>
          <button type="button" onClick={onClose} disabled={disabled} className={`rounded-full p-2 transition ${closeClass} ${disabled ? "opacity-40" : ""}`} aria-label="Tutup modal">
            <FiX className="h-5 w-5" />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}

export function RenameAnalysisModal({ isOpen, isDark, analysis, renameValue, onRenameChange, onSubmit, onClose, isLoading = false, errorMessage = "" }) {
  if (!analysis) {
    return null;
  }

  const labelClass = isDark ? "text-slate-300" : "text-slate-600";
  const inputClass = isDark
    ? "w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
    : "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none";

  return (
    <ModalShell
      isOpen={isOpen}
      isDark={isDark}
      titleId="rename-analysis-title"
      title={analysis.sourceFile || "Tanpa Judul"}
      subtitle="Ubah Nama"
      onClose={onClose}
      disabled={isLoading}
    >
      <section className="mt-6 space-y-4 rounded-2xl border px-4 py-5" aria-labelledby="rename-section-heading">
        <header className="flex items-center gap-3">
          <span className={`rounded-2xl p-2 ${isDark ? "bg-sky-500/20 text-sky-100" : "bg-sky-500/10 text-sky-600"}`}>
            <FiEdit3 className="h-5 w-5" />
          </span>
          <div>
            <p id="rename-section-heading" className="text-sm font-semibold">
              Nama Tampilan
            </p>
            <p className={`text-xs ${labelClass}`}>Nama ini akan terlihat di sidebar dan daftar analisis.</p>
          </div>
        </header>

        <input type="text" value={renameValue} onChange={(event) => onRenameChange(event.target.value)} placeholder="Masukkan nama baru..." className={inputClass} />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !renameValue.trim()}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${
              isLoading ? "bg-sky-400" : "bg-sky-600 hover:bg-sky-500"
            }`}
          >
            {isLoading ? "Menyimpan..." : "Simpan Nama"}
          </button>
          <button type="button" onClick={onClose} disabled={isLoading} className={`rounded-2xl px-4 py-2 text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Batal
          </button>
        </div>

        {errorMessage && (
          <p className="text-sm font-semibold text-red-500" role="alert">
            {errorMessage}
          </p>
        )}
      </section>
    </ModalShell>
  );
}

export function DeleteAnalysisModal({ isOpen, isDark, analysis, onConfirm, onClose, isLoading = false, errorMessage = "" }) {
  if (!analysis) {
    return null;
  }

  return (
    <ModalShell
      isOpen={isOpen}
      isDark={isDark}
      titleId="delete-analysis-title"
      title={analysis.sourceFile || "Tanpa Judul"}
      subtitle="Hapus Analisis"
      onClose={onClose}
      disabled={isLoading}
    >
      <section className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-6 space-y-4" aria-labelledby="delete-section-heading">
        <header className="flex items-center gap-3">
          <span className="rounded-2xl bg-red-500/20 p-2 text-red-500">
            <FiTrash2 className="h-5 w-5" />
          </span>
          <div>
            <p id="delete-section-heading" className="text-sm font-semibold text-red-500">
              Konfirmasi Penghapusan
            </p>
            <p className={`text-xs ${isDark ? "text-red-200" : "text-red-600"}`}>Tindakan ini akan menghapus seluruh hasil analisis secara permanen.</p>
          </div>
        </header>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition ${
            isLoading ? "cursor-wait bg-red-400" : "bg-red-600 hover:bg-red-500"
          }`}
        >
          {isLoading ? "Menghapus..." : "Hapus Sekarang"}
        </button>

        {errorMessage && (
          <p className="text-sm font-semibold text-red-500" role="alert">
            {errorMessage}
          </p>
        )}
      </section>
    </ModalShell>
  );
}
