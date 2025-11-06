// src/lib/dummy-data.js (atau letakkan di dalam page.jsx)

export const dummyKpiData = {
  totalEvents: 1245302,
  activeUsers: 8432,
  uniqueContents: 1240,
  topVerb: "experienced",
};

export const dummyActivityData = [
  { date: "2025-10-01", events: 1200 },
  { date: "2025-10-02", events: 1450 },
  { date: "2025-10-03", events: 1100 },
  { date: "2025-10-04", events: 1800 },
  { date: "2025-10-05", events: 2100 },
  { date: "2025-10-06", events: 1750 },
  { date: "2025-10-07", events: 2300 },
];

export const dummyVerbsData = [
  { verb: "experienced", count: 450000 },
  { verb: "completed", count: 210000 },
  { verb: "answered", count: 180500 },
  { verb: "viewed", count: 120000 },
  { verb: "interacted", count: 95000 },
  { verb: "launched", count: 76000 },
  { verb: "progressed", count: 55000 },
  { verb: "terminated", count: 41000 },
  { verb: "passed", count: 32000 },
  { verb: "failed", count: 21000 },
];

export const dummyObjectsData = [
  { id: 1, name: "Modul 1: Pengenalan JavaScript", count: 15200 },
  { id: 2, name: "Kuis 1: Variabel dan Tipe Data", count: 14100 },
  { id: 3, name: "Video: ES6 Arrow Functions", count: 12050 },
  { id: 4, name: "Modul 2: DOM Manipulation", count: 11500 },
  { id: 5, name: "Tugas Akhir: Membuat Kalkulator", count: 9800 },
  { id: 6, name: "Kuis 2: Loops dan Iterasi", count: 8700 },
  // ... (tambahkan hingga 25 item)
];
