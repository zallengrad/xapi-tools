"use client";

export default function ConvertModal({ isOpen, onClose, isDark, file }) {
  if (!isOpen) {
    return null;
  }

  const baseBackdrop = "fixed inset-0 z-50 flex items-center justify-center px-4";
  const backdropColor = "bg-black/60 backdrop-blur-sm";
  const cardClass = isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900";
  const subtitleClass = isDark ? "text-slate-400" : "text-slate-500";
  const highlightClass = isDark ? "text-sky-300" : "text-sky-600";

  return (
    <div className={`${baseBackdrop} ${backdropColor}`} role="dialog" aria-modal="true" aria-labelledby="convert-modal-title">
      <div className={`w-full max-w-lg rounded-2xl border p-8 shadow-xl transition-colors duration-300 ${cardClass}`}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Analisis Dimulai</p>
            <h2 id="convert-modal-title" className="mt-3 text-2xl font-bold">
              Data Anda Sedang Diproses
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent px-3 py-1 text-sm font-medium transition hover:border-sky-300 hover:text-sky-400"
          >
            Tutup
          </button>
        </div>

        <p className={`mt-4 text-sm leading-relaxed ${subtitleClass}`}>
          Kami memetakan pola aktivitas dari file <span className={`font-semibold ${highlightClass}`}>{file?.name ?? "tanpa nama"}</span>. Tunggu sebentar dan Anda akan diarahkan ke halaman hasil
          analisis.
        </p>

        <ul className={`mt-6 space-y-3 text-sm ${subtitleClass}`}>
          <li>・ Memvalidasi struktur data xAPI.</li>
          <li>・ Menghitung metrik Time-to-Fix dan frekuensi error.</li>
          <li>・ Menyusun rekomendasi pembelajaran yang personal.</li>
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:text-slate-100"
          >
            Lanjutkan Nanti
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Lihat Progres
          </button>
        </div>
      </div>
    </div>
  );
}
