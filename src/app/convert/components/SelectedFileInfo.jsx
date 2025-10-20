export default function SelectedFileInfo({ file, isDark }) {
  if (!file) {
    return null;
  }

  const textClass = isDark ? "text-slate-400" : "text-slate-600";
  const fileNameClass = isDark ? "text-slate-100" : "text-slate-800";

  return (
    <div className={`mt-4 text-sm transition-colors ${textClass}`}>
      File terpilih: <span className={`font-medium transition-colors ${fileNameClass}`}>{file.name}</span>
    </div>
  );
}
