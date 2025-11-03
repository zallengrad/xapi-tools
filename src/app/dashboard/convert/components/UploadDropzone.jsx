import { FiFile } from "react-icons/fi";

export default function UploadDropzone({ isDark, isDragging, onDragOver, onDragLeave, onDrop, onFileChange, file }) {
  const baseClass = "mt-6 border-2 border-dashed rounded-lg p-10 transition-colors duration-300";
  const dragClass = isDragging ? (isDark ? "border-sky-500 bg-slate-900/40" : "border-sky-500 bg-sky-50") : isDark ? "border-slate-600 hover:border-sky-400" : "border-slate-300 hover:border-sky-400";

  const iconColor = isDark ? "text-slate-500" : "text-slate-400";
  const textColor = isDark ? "text-slate-300" : "text-slate-600";
  const accentColor = isDark ? "text-sky-400" : "text-sky-600";
  const helperColor = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} className={`${baseClass} ${dragClass}`}>
      {file ? (
        <div className="flex flex-col items-center">
          <FiFile className={`h-8 w-8 transition-colors ${iconColor}`} />
          <p className={`mt-2 text-sm font-semibold transition-colors ${accentColor}`}>{file.name}</p>
        </div>
      ) : (
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <FiFile className={`h-8 w-8 transition-colors ${iconColor}`} />
          <span className={`mt-2 text-sm transition-colors ${textColor}`}>
            Tarik & Lepas File atau <span className={`font-semibold transition-colors ${accentColor}`}>Klik untuk Memilih</span>
          </span>
          <p className={`text-xs mt-1 transition-colors ${helperColor}`}>Hanya file .CSV yang didukung</p>
          <input id="file-upload" name="file-upload" type="file" accept=".csv" className="sr-only" onChange={onFileChange} />
        </label>
      )}
    </div>
  );
}
