/**
 * Berkas: lsa/src/app/analysis/components/FrequencyTable.jsx
 * Deskripsi: Komponen untuk merender tabel frekuensi hasil LSA Langkah 2.
 */
const FrequencyTable = ({ analysisResult }) => {
  if (!analysisResult) {
    return <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-gray-500">Hasil analisis akan ditampilkan di sini setelah Anda memproses data.</div>;
  }

  const { observed, allBehaviors, totals } = analysisResult;
  const matrix = observed;
  const { rowTotals, colTotals, grandTotal } = totals;

  return (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Langkah 2: Tabel Frekuensi Transisi (Observed)</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 font-semibold">Perilaku Awal (A)</th>
            {allBehaviors.map((behavior) => (
              <th key={behavior} className="border p-2 font-semibold">
                {behavior}
              </th>
            ))}
            <th className="border p-2 font-bold bg-blue-100">Total Awal (N_A)</th>
          </tr>
        </thead>
        <tbody>
          {allBehaviors.map((fromBehavior) => (
            <tr key={fromBehavior}>
              <td className="border p-2 font-semibold bg-gray-50">{fromBehavior}</td>
              {allBehaviors.map((toBehavior) => (
                <td key={toBehavior} className="border p-2 text-center">
                  {matrix[fromBehavior][toBehavior]}
                </td>
              ))}
              <td className="border p-2 text-center font-bold bg-blue-50">{rowTotals[fromBehavior]}</td>
            </tr>
          ))}
          <tr className="bg-green-100 font-bold">
            <td className="border p-2">Total Akhir (N_B)</td>
            {allBehaviors.map((behavior) => (
              <td key={behavior} className="border p-2 text-center">
                {colTotals[behavior]}
              </td>
            ))}
            <td className="border p-2 text-center bg-yellow-200">{grandTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FrequencyTable;
