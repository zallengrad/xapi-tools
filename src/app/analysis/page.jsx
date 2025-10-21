"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FrequencyTable from "./components/FrequencyTable";
import ZScoreTable from "./components/ZScoreTable";
import FlowDiagram from "./components/FlowDiagram";
import BehaviorChart from "./components/BehaviorChart";

const AnalysisPage = () => {
  const searchParams = useSearchParams();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const id = searchParams.get("id");

      if (!id) {
        setError("Tidak ada data untuk dianalisis. Silakan kembali ke halaman Convert untuk mengunggah file.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/analysis?id=${id}`);

        if (!response.ok) {
          const { error: message } = await response.json();
          throw new Error(message || "Gagal memuat hasil analisis.");
        }

        const row = await response.json();

        setAnalysisResult(row.payload);
        setMetadata({
          generatedAt: row.generatedAt,
          sourceFile: row.sourceFile,
          recordCount: row.recordCount,
        });
        setIsLoading(false);
      } catch (e) {
        console.error("Error mengambil hasil analisis:", e);
        setError(e instanceof Error ? e.message : "Terjadi kesalahan saat mengambil data.");
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // 2. Tampilan UI berdasarkan status loading, error, atau sukses
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500">Memuat dan menganalisis data...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500 font-semibold">{error}</p>;
    }

    if (analysisResult) {
      return (
        <div className="space-y-12">
          <FrequencyTable analysisResult={analysisResult} />
          <ZScoreTable analysisResult={analysisResult} />
          <FlowDiagram analysisResult={analysisResult} />
          <BehaviorChart transitions={analysisResult.significantTransitions ?? []} />
        </div>
      );
    }

    return null; // Tidak menampilkan apa-apa jika tidak ada kondisi yang terpenuhi
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Hasil Analisis Sekuensial Lag (LSA)</h1>
        {metadata && (
          <p className="text-center text-sm text-gray-500">
            Sumber: <span className="font-medium">{metadata.sourceFile}</span> • {metadata.recordCount} kejadian • Dibuat {new Date(metadata.generatedAt).toLocaleString("id-ID")}
          </p>
        )}
        <div className="mt-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AnalysisPage;
