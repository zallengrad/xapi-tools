"use client";

import { FiHelpCircle } from "react-icons/fi";

/**
 * Tombol ikon bantuan (?) yang mendukung dark/light mode.
 * @param {object} props
 * @param {function} props.onClick - Fungsi yang akan dipanggil saat tombol diklik.
 * @param {string} [props.className] - Kelas Tailwind tambahan untuk kustomisasi.
 * @param {string} [props.ariaLabel] - Label aksesibilitas (default: "Bantuan").
 */
export default function HelpButton({ onClick, className = "", ariaLabel = "Bantuan", ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        rounded-full p-2 transition-colors duration-200
        
        // --- Light Mode (Default) ---
        text-slate-500 // Warna ikon
        hover:bg-slate-200 // Latar belakang saat di-hover
        hover:text-slate-800 // Warna ikon saat di-hover
        
        // --- Dark Mode (via 'dark:' variant) ---
        dark:text-slate-400 // Warna ikon di dark mode
        dark:hover:bg-slate-700 // Latar belakang saat di-hover di dark mode
        dark:hover:text-slate-100 // Warna ikon saat di-hover di dark mode

        // --- Focus/Accessibility ---
        focus:outline-none
        focus:ring-2
        focus:ring-sky-500
        focus:ring-offset-2
        dark:focus:ring-offset-slate-900

        ${className}
      `}
      {...rest}
    >
      <FiHelpCircle className="h-5 w-5" />
    </button>
  );
}
