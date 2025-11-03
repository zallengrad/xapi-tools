const ZScoreTable = ({ analysisResult, isDarkMode }) => {
  const themed = (light, dark) => (isDarkMode ? dark : light);

  if (!analysisResult) return null;

  const { zScores, allBehaviors } = analysisResult;

  const getCellColor = (z) => {
    if (z >= 1.96) {
      return themed("bg-green-100 text-green-800 font-bold", "bg-green-900/40 text-green-300 font-bold");
    }
    if (z <= -1.96) {
      return themed("bg-red-100 text-red-800", "bg-red-900/40 text-red-300");
    }
    return "";
  };

  return (
    <div className={`mt-8 overflow-x-auto rounded-3xl border shadow-sm p-6 transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <h2 className={`text-2xl font-semibold mb-4 transition-colors ${themed("text-slate-900", "text-white")}`}>Tabel Z-Score (Adjusted Residuals)</h2>
      <p className={`text-sm mb-4 transition-colors ${themed("text-slate-600", "text-slate-300")}`}>Nilai Z-score ≥ 1.96 menunjukkan transisi signifikan positif (hijau).</p>

      <div className="overflow-x-auto">
        <table className={`min-w-full border-collapse border transition-colors ${themed("border-slate-300", "border-slate-600")}`}>
          <thead className={`transition-colors ${themed("bg-slate-100", "bg-slate-800")}`}>
            <tr>
              <th className={`border p-2 font-semibold transition-colors ${themed("border-slate-300 text-slate-900", "border-slate-600 text-white")}`}>Dari (A)</th>
              {allBehaviors.map((behavior) => (
                <th key={behavior} className={`border p-2 font-semibold transition-colors ${themed("border-slate-300 text-slate-900", "border-slate-600 text-white")}`}>
                  {behavior}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allBehaviors.map((fromBehavior) => (
              <tr key={fromBehavior}>
                <td className={`border p-2 font-semibold transition-colors ${themed("border-slate-300 bg-slate-50 text-slate-900", "border-slate-600 bg-slate-800/50 text-white")}`}>{fromBehavior}</td>
                {allBehaviors.map((toBehavior) => {
                  const z = zScores[fromBehavior][toBehavior];
                  return (
                    <td key={toBehavior} className={`border p-2 text-center transition-colors ${themed("border-slate-300", "border-slate-600")} ${getCellColor(z)}`}>
                      {z.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZScoreTable;
