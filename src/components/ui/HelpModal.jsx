// src/components/ui/HelpModal.jsx

"use client";

import { FiX, FiCheckCircle, FiFileText, FiUploadCloud } from "react-icons/fi";

/**
 * Komponen Modal Reusable untuk Bantuan
 * @param {object} props
 * @param {boolean} props.isOpen - Boolean untuk menampilkan atau menyembunyikan modal
 * @param {function} props.onClose - Fungsi yang dipanggil saat modal ditutup
 */
export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  // Styling (mengikuti pola dari ConvertModal dan komponen Anda yang lain)
  const backdropClass = "bg-black/60 backdrop-blur-sm";
  const cardClass = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100";
  const subtitleClass = "text-slate-600 dark:text-slate-300";
  const iconWrapperClass = "flex-shrink-0 w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 flex items-center justify-center";
  const codeBlockClass = "p-3 mt-2 text-xs rounded-md bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono overflow-x-auto";

  return (
    // Backdrop / Overlay
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${backdropClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={onClose} // Menutup modal saat mengklik backdrop
    >
      {/* Konten Modal */}
      <div
        className={`w-full max-w-2xl rounded-2xl p-6 shadow-xl transition-colors ${cardClass}`}
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between">
          <h2 id="help-modal-title" className="text-xl font-bold">
            Panduan Penggunaan Halaman Upload
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 transition-colors text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700" aria-label="Tutup modal">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* --- Konten Bantuan (Hasil Parafrasa) --- */}
        <div className="mt-6 space-y-6">
          {/* Langkah 1: Format File */}
          <div className="flex gap-4">
            <div className={iconWrapperClass}>
              <FiFileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">1. Pastikan Format File Benar</h3>
              <p className={`mt-1 text-sm ${subtitleClass}`}>Aplikasi ini hanya dapat memproses file berformat `.csv` (Comma Separated Values) yang berisi data log xAPI. Pastikan baris pertama file Anda adalah *header* (judul kolom).</p>
            </div>
          </div>

          {/* Langkah 2: Struktur Data */}
          <div className="flex gap-4">
            <div className={iconWrapperClass}>
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">2. Siapkan Kolom Data xAPI</h3>
              <p className={`mt-1 text-sm ${subtitleClass}`}>
                Agar analisis berjalan akurat, pastikan file `.csv` Anda memiliki kolom-kolom penting yang sesuai dengan standar xAPI. Kolom utama yang kami cari adalah: `timestamp`, `actor_...` (email/nama), `verb`, dan `object_...`
                (nama/id).
              </p>
              <p className={`mt-2 text-xs ${subtitleClass}`}>Contoh format header dan data (disederhanakan):</p>
              <pre className={codeBlockClass}>
                {`id,timestamp,actor_name,verb,object_name,object_id
"a1b2c...","2025-11-03T16:10Z","Budi","completed","Kuis 1","...quiz-1"
"b2c3d...","2025-11-03T16:15Z","Ani","viewed","Video 1","...video-1"`}
              </pre>
            </div>
          </div>

          {/* Langkah 3: Unggah & Analisis */}
          <div className="flex gap-4">
            <div className={iconWrapperClass}>
              <FiUploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">3. Unggah dan Tunggu</h3>
              <p className={`mt-1 text-sm ${subtitleClass}`}>
                Tarik (drag-and-drop) file Anda ke kotak unggah, atau klik kotak tersebut untuk memilih file. Setelah file siap, klik tombol **"Mulai Analisis"**. Harap tunggu beberapa saat hingga proses selesai dan Anda akan diarahkan ke
                halaman hasil.
              </p>
            </div>
          </div>
        </div>
        {/* --- Akhir Konten Bantuan --- */}

        {/* Footer Modal */}
        <div className="mt-8 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
