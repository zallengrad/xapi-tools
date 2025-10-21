// /app/convert/page.jsx

"use client";

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import ThemeToggle from "../../components/ui/ThemeToggle";
import UploadDropzone from "./components/UploadDropzone";
import SelectedFileInfo from "./components/SelectedFileInfo";
import UploadStatus from "./components/UploadStatus";
import ConvertModal from "./components/ConvertModal";
import { useThemeContext } from "../../context/theme/ThemeContext";

// manajemen state
export default function ConvertPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { isDark, toggle, ready } = useThemeContext();

  // definisi tema (gelap/terang)
  const theme = isDark
    ? {
        main: "bg-slate-900 text-slate-100",
        card: "bg-slate-800 border-slate-700",
        heading: "text-white",
        subtitle: "text-slate-400",
        footer: "text-slate-500",
        disabledButton: "disabled:bg-slate-600 disabled:text-slate-300",
      }
    : {
        main: "bg-slate-50 text-slate-900",
        card: "bg-white border-slate-200",
        heading: "text-slate-800",
        subtitle: "text-slate-500",
        footer: "text-slate-400",
        disabledButton: "disabled:bg-slate-400 disabled:text-slate-200",
      };

  // fungsi untuk penanganan aksi (event handlers)
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setMessage("");
    } else {
      setFile(null);
      setMessage("Harap pilih file dengan format .csv");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Silakan pilih file terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    setMessage(`Mengunggah ${file.name}...`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    setMessage(`File "${file.name}" berhasil dianalisis!`);
    setShowModal(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      setMessage("");
    } else {
      setFile(null);
      setMessage("File tidak valid. Harap unggah file .csv");
    }
  };

  return (
    <main className={`flex min-h-screen w-full flex-col items-center justify-center transition-colors duration-300 p-4 ${theme.main}`}>
      {ready && <ThemeToggle isDark={isDark} onToggle={toggle} className="absolute top-4 right-4" />}
      <ConvertModal isOpen={showModal} onClose={() => setShowModal(false)} isDark={isDark} file={file} />

      <div className="w-full max-w-2xl">
        <div className={`shadow-sm rounded-xl border p-8 text-center transition-colors duration-300 ${theme.card}`}>
          <FiUploadCloud className="mx-auto h-16 w-16 text-sky-500" />

          <h1 className={`mt-4 text-2xl font-bold transition-colors ${theme.heading}`}>Unggah Data Aktivitas xAPI</h1>
          <p className={`mt-2 text-sm transition-colors ${theme.subtitle}`}>Silakan unggah file CSV dari LMS Anda untuk memulai analisis pola kerja.</p>

          <UploadDropzone isDark={isDark} isDragging={isDragging} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onFileChange={handleFileChange} file={file} />

          {file && !message.includes("berhasil") && <SelectedFileInfo file={file} isDark={isDark} />}

          <div className="mt-8">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`cursor-pointer w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-sky-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed transition-all duration-300 ${theme.disabledButton}`}
            >
              {isUploading ? "Menganalisis..." : "Mulai Analisis"}
            </button>
          </div>

          <UploadStatus message={message} isDark={isDark} />
        </div>

        <p className={`text-center text-xs mt-4 transition-colors ${theme.footer}`}>DevLens | Melihat Lebih Dekat Pola Pengerjaan Kode Anda.</p>
      </div>
    </main>
  );
}
