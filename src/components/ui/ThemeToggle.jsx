import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ isDark, onToggle, className = "" }) {
  const baseClass =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300";
  const themeClass = isDark ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-slate-200 text-slate-700 hover:bg-slate-300";

  return (
    <button type="button" onClick={onToggle} className={`${baseClass} ${themeClass} ${className}`.trim()} aria-label="Toggle theme">
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
