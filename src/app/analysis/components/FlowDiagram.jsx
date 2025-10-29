export default function FlowDiagram({ analysisResult, isDarkMode }) {
  const themed = (light, dark) => (isDarkMode ? dark : light);
  const transitions = analysisResult?.significantTransitions ?? [];

  if (!transitions.length) {
    return (
      <div className={`mt-8 rounded-lg border border-dashed p-6 text-sm transition-colors ${themed("border-slate-300 text-slate-500", "border-slate-600 text-slate-400")}`}>Tidak ada transisi signifikan (Z ≥ 1.96) yang terdeteksi.</div>
    );
  }

  return (
    <div className={`mt-8 rounded-3xl border shadow-sm p-6 transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <h2 className={`text-2xl font-semibold mb-4 transition-colors ${themed("text-slate-900", "text-white")}`}>Langkah 4: Transisi Signifikan</h2>
      <div className="space-y-3">
        {transitions.map((item) => (
          <div key={`${item.from}-${item.to}`} className={`rounded-xl border p-4 shadow-sm transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/50")}`}>
            <p className={`text-sm transition-colors ${themed("text-slate-700", "text-slate-200")}`}>
              <span className="font-semibold">{item.from}</span> → <span className="font-semibold">{item.to}</span>
            </p>
            <p className={`text-sm transition-colors ${themed("text-green-600", "text-green-400")}`}>Z-score: {item.z.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
