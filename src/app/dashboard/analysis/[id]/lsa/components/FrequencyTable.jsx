const FrequencyTable = ({ analysisResult, isDarkMode }) => {
  const themed = (light, dark) => (isDarkMode ? dark : light);

  if (!analysisResult) {
    return (
      <div className={`mt-6 p-4 border rounded-lg transition-colors ${themed("bg-slate-50 border-slate-200 text-slate-500", "bg-slate-900/50 border-slate-700 text-slate-400")}`}>
        Hasil analisis akan ditampilkan di sini setelah Anda memproses data.
      </div>
    );
  }

  const { observed, allBehaviors, totals } = analysisResult;
  const matrix = observed;
  const { rowTotals, colTotals, grandTotal } = totals;

  return (
    <div className={`mt-8 overflow-x-auto rounded-3xl border shadow-sm p-6 transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <h2 className={`text-2xl font-semibold mb-4 transition-colors ${themed("text-slate-900", "text-white")}`}>Tabel Frekuensi Transisi (Observed)</h2>

      <div className="overflow-x-auto">
        <table className={`min-w-full border-collapse border transition-colors ${themed("border-slate-300", "border-slate-600")}`}>
          <thead className={`transition-colors ${themed("bg-slate-100", "bg-slate-800")}`}>
            <tr>
              <th className={`border p-2 font-semibold transition-colors ${themed("border-slate-300 text-slate-900", "border-slate-600 text-white")}`}>Perilaku Awal (A)</th>
              {allBehaviors.map((behavior) => (
                <th key={behavior} className={`border p-2 font-semibold transition-colors ${themed("border-slate-300 text-slate-900", "border-slate-600 text-white")}`}>
                  {behavior}
                </th>
              ))}
              <th className={`border p-2 font-bold transition-colors ${themed("border-slate-300 bg-blue-100 text-blue-900", "border-slate-600 bg-blue-900/50 text-blue-200")}`}>Total Awal (N_A)</th>
            </tr>
          </thead>
          <tbody>
            {allBehaviors.map((fromBehavior) => (
              <tr key={fromBehavior}>
                <td className={`border p-2 font-semibold transition-colors ${themed("border-slate-300 bg-slate-50 text-slate-900", "border-slate-600 bg-slate-800/50 text-white")}`}>{fromBehavior}</td>
                {allBehaviors.map((toBehavior) => (
                  <td key={toBehavior} className={`border p-2 text-center transition-colors ${themed("border-slate-300 text-slate-800", "border-slate-600 text-slate-200")}`}>
                    {matrix[fromBehavior][toBehavior]}
                  </td>
                ))}
                <td className={`border p-2 text-center font-bold transition-colors ${themed("border-slate-300 bg-blue-50 text-blue-900", "border-slate-600 bg-blue-900/30 text-blue-200")}`}>{rowTotals[fromBehavior]}</td>
              </tr>
            ))}
            <tr className={`font-bold transition-colors ${themed("bg-green-100", "bg-green-900/30")}`}>
              <td className={`border p-2 transition-colors ${themed("border-slate-300 text-slate-900", "border-slate-600 text-white")}`}>Total Akhir (N_B)</td>
              {allBehaviors.map((behavior) => (
                <td key={behavior} className={`border p-2 text-center transition-colors ${themed("border-slate-300 text-slate-900", "border-slate-600 text-white")}`}>
                  {colTotals[behavior]}
                </td>
              ))}
              <td className={`border p-2 text-center transition-colors ${themed("border-slate-300 bg-yellow-200 text-yellow-900", "border-slate-600 bg-yellow-900/40 text-yellow-200")}`}>{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FrequencyTable;
