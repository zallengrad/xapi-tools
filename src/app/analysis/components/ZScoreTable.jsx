/**
 * Berkas: lsa/src/app/analysis/components/ZScoreTable.jsx
 * Deskripsi: Komponen untuk merender tabel Z-score hasil LSA Langkah 4.
 */
const ZScoreTable = ({ analysisResult }) => {
  if (!analysisResult) return null;

  const { zScores, allBehaviors } = analysisResult;

  const getCellColor = (z) => {
    if (z >= 1.96) return "bg-green-100 text-green-800 font-bold";
    if (z <= -1.96) return "bg-red-100 text-red-800";
    return "";
  };

  return (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Langkah 4: Tabel Z-Score (Adjusted Residuals)</h2>
      <p className="text-sm text-gray-600 mb-2">Nilai Z-score ≥ 1.96 menunjukkan transisi signifikan positif (hijau).</p>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 font-semibold">Dari (A)</th>
            {allBehaviors.map((behavior) => (
              <th key={behavior} className="border p-2 font-semibold">
                {behavior}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allBehaviors.map((fromBehavior) => (
            <tr key={fromBehavior}>
              <td className="border p-2 font-semibold bg-gray-50">{fromBehavior}</td>
              {allBehaviors.map((toBehavior) => {
                const z = zScores[fromBehavior][toBehavior];
                return (
                  <td key={toBehavior} className={`border p-2 text-center ${getCellColor(z)}`}>
                    {z.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZScoreTable;
