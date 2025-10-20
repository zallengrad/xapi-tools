import { FiCheckCircle } from "react-icons/fi";

export default function UploadStatus({ message, isDark }) {
  if (!message) {
    return null;
  }

  const baseClass = "mt-4 flex items-center justify-center gap-2 text-sm transition-all duration-300";
  let colorClass = isDark ? "text-red-400" : "text-red-600";

  if (message.includes("berhasil")) {
    colorClass = isDark ? "text-green-400" : "text-green-600";
  } else if (message.includes("Mengunggah")) {
    colorClass = isDark ? "text-slate-400" : "text-slate-500";
  }

  return (
    <div className={`${baseClass} ${colorClass}`}>
      {message.includes("berhasil") && <FiCheckCircle />}
      <p>{message}</p>
    </div>
  );
}
