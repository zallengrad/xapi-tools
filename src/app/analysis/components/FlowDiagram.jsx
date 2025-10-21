export default function FlowDiagram({ analysisResult }) {
  const transitions = analysisResult?.significantTransitions ?? [];

  if (!transitions.length) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500">
        Tidak ada transisi signifikan (Z ≥ 1.96) yang terdeteksi.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Langkah 4: Transisi Signifikan</h2>
      <div className="space-y-3">
        {transitions.map((item) => (
          <div key={`${item.from}-${item.to}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{item.from}</span> → <span className="font-semibold">{item.to}</span>
            </p>
            <p className="text-sm text-green-600">Z-score: {item.z.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
