"use client";

import { FiCheckCircle } from "react-icons/fi";

export default function ConvertModal({ isOpen, onClose, isDark, file, progress = 0, statusMessage = "", isComplete = false }) {
  if (!isOpen) {
    return null;
  }

  const baseBackdrop = "fixed inset-0 z-50 flex items-center justify-center px-4";
  const backdropColor = "bg-black/60 backdrop-blur-sm";
  const cardClass = isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900";
  const subtitleClass = isDark ? "text-slate-400" : "text-slate-500";
  const highlightClass = isDark ? "text-sky-300" : "text-sky-600";

  const progressValue = Math.min(100, Math.max(0, Math.round(progress)));
  const primaryText = isComplete ? "Analisis Selesai" : "Data Anda Sedang Diproses";
  const secondaryText = isComplete ? "Anda akan segera diarahkan ke hasil analisis." : "Jangan tutup tab ini, kami sedang menyiapkan insight terbaik untuk Anda.";

  return (
    <div className={`${baseBackdrop} ${backdropColor}`} role="dialog" aria-modal="true" aria-labelledby="convert-modal-title">
      <div className={`w-full max-w-lg rounded-2xl border p-8 shadow-xl transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Analisis Dimulai</p>
            <h2 id="convert-modal-title" className="mt-3 text-2xl font-bold">
              {primaryText}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={!isComplete}
            className={`rounded-full border border-transparent px-3 py-1 text-sm font-medium transition ${
              isComplete ? "hover:border-sky-300 hover:text-sky-400" : "cursor-not-allowed opacity-40"
            }`}
          >
            {isComplete ? "Tutup" : "Sedang Berjalan"}
          </button>
        </div>

        <p className={`mt-4 text-sm leading-relaxed ${subtitleClass}`}>
          Kami memetakan pola aktivitas dari file <span className={`font-semibold ${highlightClass}`}>{file?.name ?? "tanpa nama"}</span>. Tunggu sebentar dan Anda akan diarahkan ke halaman hasil
          analisis.
        </p>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-dashed p-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
              <span className={subtitleClass}>{isComplete ? "Status" : "Progres Analisis"}</span>
              <span className={`text-base ${isComplete ? "text-emerald-500" : "text-sky-500"}`}>{isComplete ? "100%" : `${progressValue}%`}</span>
            </div>
            <div className={`mt-3 h-2 w-full rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${isComplete ? "bg-emerald-500" : "bg-sky-500"}`}
                style={{ width: `${isComplete ? 100 : progressValue}%` }}
              />
            </div>
            <p className={`mt-3 text-sm ${subtitleClass}`}>{statusMessage || "Menyiapkan analisis..."}</p>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            {isComplete ? (
              <FiCheckCircle className="h-12 w-12 text-emerald-500" />
            ) : (
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-sky-200 border-t-sky-500" aria-label="Loading indicator" />
            )}
            <p className={`text-sm font-medium ${subtitleClass}`}>{secondaryText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

