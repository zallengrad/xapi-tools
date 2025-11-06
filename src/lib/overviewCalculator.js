/**
 * Berkas: src/lib/overviewCalculator.js
 * Deskripsi: Kumpulan fungsi untuk menghitung metrik Overview
 * dari data xAPI yang sudah dinormalisasi.
 */

/**
 * Mengambil array baris data dan menghitung semua metrik overview.
 * * @param {Array<Object>} normalizedRows - Array data dari PapaParse,
 * diasumsikan memiliki properti: `actor_id`, `verb`, `object`, `timestamp`.
 * @returns {Object} - Objek yang siap disimpan ke model OverviewResult.
 */
export const calculateOverviewData = (normalizedRows) => {
  const totalEvents = normalizedRows.length;

  // Kita gunakan Map untuk menghitung frekuensi (lebih cepat)
  const userSet = new Set();
  const objectSet = new Set();
  const verbCounts = new Map();
  const objectCounts = new Map();
  const activityCounts = new Map(); // { '2025-10-01': 120, '2025-10-02': 150 }

  // --- Mulai Loop Utama (Satu Kali untuk Efisiensi) ---
  for (const row of normalizedRows) {
    // 1. Ambil data (beri nilai default jika null/undefined)
    const actor = row.actor_id || "unknown_actor";
    const verb = row.verb || "unknown_verb";
    const object = row.object || "unknown_object";
    const timestamp = row.timestamp;

    // 2. Hitung KPI unik
    userSet.add(actor);
    objectSet.add(object);

    // 3. Hitung frekuensi Verb
    verbCounts.set(verb, (verbCounts.get(verb) || 0) + 1);

    // 4. Hitung frekuensi Object
    objectCounts.set(object, (objectCounts.get(object) || 0) + 1);

    // 5. Hitung event per hari
    if (timestamp) {
      try {
        // Normalisasi timestamp ke format YYYY-MM-DD
        const date = new Date(timestamp).toISOString().split("T")[0];
        activityCounts.set(date, (activityCounts.get(date) || 0) + 1);
      } catch (e) {
        // Abaikan jika ada format tanggal yang tidak valid
        console.warn("Invalid timestamp format skipped:", timestamp);
      }
    }
  }
  // --- Akhir Loop Utama ---

  // --- Proses Hasil Kalkulasi ---

  // Proses Verbs: Ubah Map -> Array, urutkan, ambil 10 teratas
  const topVerbs = Array.from(verbCounts, ([verb, count]) => ({ verb, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Ambil Top 10 untuk grafik

  // Proses Objects: Ubah Map -> Array, urutkan, ambil 25 teratas
  const topObjects = Array.from(objectCounts, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 25); // Ambil Top 25 untuk tabel

  // Proses Aktivitas Harian: Ubah Map -> Array, urutkan berdasarkan tanggal
  const dailyActivity = Array.from(activityCounts, ([date, events]) => ({ date, events })).sort((a, b) => a.date.localeCompare(b.date));

  // --- Susun Objek Hasil Akhir (sesuai schema.prisma baru kita) ---
  return {
    // KPI (Kolom Langsung)
    totalEvents: totalEvents,
    activeUsers: userSet.size,
    uniqueContents: objectSet.size,
    topVerb: topVerbs[0]?.verb || "N/A", // Ambil verb paling atas

    // Data Grafik (Kolom JSON)
    dailyActivity: dailyActivity,
    topVerbs: topVerbs,
    topObjects: topObjects,
  };
};
