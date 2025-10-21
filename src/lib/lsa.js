/**
 * Berkas: lsa/src/lib/lsa.js
 * Deskripsi: Kumpulan fungsi untuk kalkulasi Lag Sequential Analysis (LSA).
 */

/**
 * Langkah 2: Menghitung Frekuensi Transisi yang Diamati (O_AB).
 * (Fungsi dari langkah sebelumnya)
 */
export const calculateObservedFrequencies = (data) => {
  const sortedData = [...data].sort((a, b) => {
    if (a.peneliti_id < b.peneliti_id) return -1;
    if (a.peneliti_id > b.peneliti_id) return 1;
    // Pastikan urutan_id adalah angka untuk perbandingan yang benar
    return Number(a.urutan_id) - Number(b.urutan_id);
  });

  const transitions = {};
  const allBehaviors = new Set();

  for (let i = 0; i < sortedData.length - 1; i++) {
    const current = sortedData[i];
    const next = sortedData[i + 1];

    if (current.peneliti_id === next.peneliti_id) {
      const fromBehavior = current.kejadian;
      const toBehavior = next.kejadian;

      allBehaviors.add(fromBehavior);
      allBehaviors.add(toBehavior);

      if (!transitions[fromBehavior]) {
        transitions[fromBehavior] = {};
      }
      if (!transitions[fromBehavior][toBehavior]) {
        transitions[fromBehavior][toBehavior] = 0;
      }
      transitions[fromBehavior][toBehavior]++;
    }
  }

  const behaviorList = Array.from(allBehaviors).sort();
  const matrix = {};
  for (const from of behaviorList) {
    matrix[from] = {};
    for (const to of behaviorList) {
      matrix[from][to] = (transitions[from] && transitions[from][to]) || 0;
    }
  }

  const rowTotals = {};
  const colTotals = {};
  let grandTotal = 0;

  for (const from of behaviorList) {
    let sum = 0;
    for (const to of behaviorList) {
      sum += matrix[from][to];
    }
    rowTotals[from] = sum;
    grandTotal += sum;
  }

  for (const to of behaviorList) {
    let sum = 0;
    for (const from of behaviorList) {
      sum += matrix[from][to];
    }
    colTotals[to] = sum;
  }

  return {
    observed: matrix,
    allBehaviors: behaviorList,
    totals: {
      rowTotals,
      colTotals,
      grandTotal,
    },
  };
};

/**
 * Langkah 3: Menghitung Frekuensi Transisi yang Diharapkan (E_AB).
 *
 * @param {Object} observedResult - Hasil dari calculateObservedFrequencies.
 * @returns {Object} Matriks frekuensi yang diharapkan.
 */
export const calculateExpectedFrequencies = (observedResult) => {
  const { totals, allBehaviors } = observedResult;
  const { rowTotals, colTotals, grandTotal } = totals;

  if (grandTotal === 0) {
    // Hindari pembagian dengan nol jika tidak ada transisi
    const zeroMatrix = {};
    for (const from of allBehaviors) {
      zeroMatrix[from] = {};
      for (const to of allBehaviors) {
        zeroMatrix[from][to] = 0;
      }
    }
    return zeroMatrix;
  }

  // Hitung probabilitas marginal P(B)
  const p_b = {};
  for (const behavior of allBehaviors) {
    p_b[behavior] = colTotals[behavior] / grandTotal;
  }

  // Hitung matriks ekspektasi E_AB = N_A * P(B)
  const expectedMatrix = {};
  for (const from of allBehaviors) {
    expectedMatrix[from] = {};
    for (const to of allBehaviors) {
      const n_a = rowTotals[from];
      expectedMatrix[from][to] = n_a * p_b[to];
    }
  }

  return expectedMatrix;
};

/**
 * Langkah 4: Menghitung Z-score (Adjusted Residual).
 *
 * @param {Object} observedResult - Hasil dari calculateObservedFrequencies.
 * @param {Object} expectedMatrix - Hasil dari calculateExpectedFrequencies.
 * @returns {Object} Objek berisi matriks Z-score dan daftar transisi signifikan.
 */
export const calculateZScores = (observedResult, expectedMatrix) => {
  const { observed, allBehaviors, totals } = observedResult;
  const { rowTotals, colTotals, grandTotal } = totals;

  if (grandTotal === 0) {
    return { zScoreMatrix: {}, significantTransitions: [] };
  }

  // Hitung P(A) dan P(B)
  const p_row = {};
  const p_col = {};
  for (const behavior of allBehaviors) {
    p_row[behavior] = rowTotals[behavior] / grandTotal;
    p_col[behavior] = colTotals[behavior] / grandTotal;
  }

  const zScoreMatrix = {};
  const significantTransitions = [];

  for (const from of allBehaviors) {
    zScoreMatrix[from] = {};
    for (const to of allBehaviors) {
      const observedValue = observed[from][to];
      const expectedValue = expectedMatrix[from][to];

      // Hindari pembagian dengan nol
      if (expectedValue === 0) {
        zScoreMatrix[from][to] = 0;
        continue;
      }

      const numerator = observedValue - expectedValue;
      const denominator = Math.sqrt(expectedValue * (1 - p_row[from]) * (1 - p_col[to]));

      const zScore = denominator === 0 ? 0 : numerator / denominator;
      zScoreMatrix[from][to] = zScore;

      // Kumpulkan transisi yang signifikan (Z >= 1.96)
      if (zScore >= 1.96) {
        significantTransitions.push({
          from: from,
          to: to,
          z: zScore,
        });
      }
    }
  }

  // Urutkan transisi signifikan dari Z-score tertinggi
  significantTransitions.sort((a, b) => b.z - a.z);

  return { zScoreMatrix, significantTransitions };
};

/**
 * Fungsi utama untuk menjalankan seluruh alur analisis LSA.
 */
export const runLSA = (data) => {
  // Langkah 2
  const observedResult = calculateObservedFrequencies(data);
  // Langkah 3
  const expectedMatrix = calculateExpectedFrequencies(observedResult);
  // Langkah 4
  const { zScoreMatrix, significantTransitions } = calculateZScores(observedResult, expectedMatrix);

  return {
    ...observedResult,
    expected: expectedMatrix,
    zScores: zScoreMatrix,
    significantTransitions,
  };
};
