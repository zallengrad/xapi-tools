// /app/convert/page.jsx

"use client";

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import ThemeToggle from "../../../components/ui/ThemeToggle";
import UploadDropzone from "./components/UploadDropzone";
import SelectedFileInfo from "./components/SelectedFileInfo";
import UploadStatus from "./components/UploadStatus";
import ConvertModal from "./components/ConvertModal";
import { useThemeContext } from "../../../context/theme/ThemeContext";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { assignBehaviorCode } from "../../../lib/behaviorCode";
import { runLSA } from "../../../lib/lsa";

// manajemen state
export default function ConvertPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { isDark, toggle, ready } = useThemeContext();
  const router = useRouter();

  const safeJsonParse = (value) => {
    if (typeof value !== "string" || !value.trim()) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const normalizeRow = (row) => {
    const rawPayload = safeJsonParse(row.raw) || {};
    const contextPayload = safeJsonParse(row.context) || rawPayload.context || {};
    const extensions = contextPayload?.extensions || {};

    const actorFromRaw = rawPayload?.actor?.account?.name || rawPayload?.actor?.mbox || null;

    const actorId = row.actor_id || row.user_id || actorFromRaw || "unknown";
    const sessionId = row.session_id || extensions["https://app.example.com/xapi/ext/session_id"] || extensions["session_id"] || null;

    const localTimestamp = row.timestamp || row.local_timestamp || extensions["https://app.example.com/xapi/ext/localTimestamp"] || extensions["localTimestamp"] || rawPayload?.timestamp || null;

    const verb = row.verb || row.verb_id || rawPayload?.verb?.id || "";
    const object = row.object || row.object_id || rawPayload?.object?.id || "";

    return {
      ...row,
      actor_id: actorId,
      session_id: sessionId,
      timestamp: localTimestamp,
      verb,
      object,
    };
  };

  // definisi tema (gelap/terang)
  const theme = isDark
    ? {
        main: "bg-slate-950 text-slate-100",
        card: "bg-slate-800 border-slate-700",
        heading: "text-white",
        subtitle: "text-slate-400",
        footer: "text-slate-500",
        disabledButton: "disabled:bg-slate-600 disabled:text-slate-300",
      }
    : {
        main: "bg-slate-100 text-slate-900",
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

    try {
      const results = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject,
        });
      });

      const normalizedRows = results.data.map((row) => normalizeRow(row));

      const codedData = normalizedRows.map((row) => ({
        ...row,
        behavior_code: assignBehaviorCode(row),
      }));

      const cleanData = codedData.filter((row) => row.behavior_code !== null);

      if (cleanData.length === 0) {
        setMessage("Tidak ada baris yang cocok dengan aturan perilaku. Periksa kembali struktur file Anda.");
        setIsUploading(false);
        return;
      }

      const sortedData = cleanData.sort((a, b) => {
        if (a.actor_id < b.actor_id) return -1;
        if (a.actor_id > b.actor_id) return 1;

        const sessionA = a.session_id || "";
        const sessionB = b.session_id || "";
        if (sessionA < sessionB) return -1;
        if (sessionA > sessionB) return 1;

        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB;
      });

      const lsaFormattedData = sortedData.map((row) => ({
        peneliti_id: row.actor_id,
        urutan_id: new Date(row.timestamp).getTime(),
        kejadian: row.behavior_code,
      }));

      const analysisResult = runLSA(lsaFormattedData);
      const payload = {
        generatedAt: new Date().toISOString(),
        sourceFile: file.name,
        recordCount: lsaFormattedData.length,
        analysis: analysisResult,
      };

      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan hasil analisis");
      }

      const { id } = await response.json();

      setMessage(`Konversi berhasil! Mengarahkan ke halaman analisis...`);
      setShowModal(true);
      setIsUploading(false);

      setTimeout(() => {
        router.push(`/dashboard/analysis/${id}`);
      }, 1200);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      if (error?.name === "QuotaExceededError") {
        setMessage("Data terlalu besar untuk disimpan di browser. Kurangi ukuran file atau jalankan analisis melalui backend.");
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Gagal membaca atau memproses file CSV. Pastikan format file sesuai.");
      }
      setIsUploading(false);
    }
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
