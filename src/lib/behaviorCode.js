/**
 * Berkas: lsa/src/lib/behaviorCode.js
 * Deskripsi: Logika untuk mengubah baris data mentah menjadi kode perilaku (Langkah 1 LSA).
 * Ini adalah konversi dari logika Python yang Anda berikan.
 */

// --- FUNGSI HELPERS (PEMBANTU) ---

/**
 * Memeriksa apakah sebuah string mengandung semua token yang diberikan (case-insensitive).
 * @param {string} value - String yang akan diperiksa.
 * @param  {...string} tokens - Token-token yang harus ada.
 * @returns {boolean}
 */
const contains = (value, ...tokens) => {
  if (typeof value !== "string") {
    return false;
  }
  const valueLow = value.toLowerCase();
  return tokens.every((tok) => valueLow.includes(tok.toLowerCase()));
};

/**
 * Memeriksa apakah 'verb' diakhiri dengan suffix tertentu.
 * @param {object} row - Baris data.
 * @param {string} verbSuffix - Akhiran verb yang dicari.
 * @returns {boolean}
 */
const verbIs = (row, verbSuffix) => {
  const v = row.verb;
  return typeof v === "string" && v.endsWith(verbSuffix);
};

/**
 * Memeriksa apakah 'object' diawali dengan prefix tertentu.
 * @param {object} row - Baris data.
 * @param {string} prefix - Awalan object yang dicari.
 * @returns {boolean}
 */
const objectPrefix = (row, prefix) => {
  const obj = row.object;
  return typeof obj === "string" && obj.startsWith(prefix);
};

/**
 * Helper untuk parsing JSON dengan aman dari sebuah string.
 * @param {string} jsonString - String JSON.
 * @returns {object|null}
 */
const safeJsonParse = (jsonString) => {
  if (typeof jsonString !== "string" || !jsonString.trim()) {
    return null;
  }
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

/**
 * Mengambil nilai 'success' dari kolom 'result'.
 * @param {object} row - Baris data.
 * @returns {boolean|null}
 */
const resultSuccess = (row) => {
  const payload = safeJsonParse(row.result);
  return payload ? payload.success : null;
};

// --- FUNGSI UTAMA PENGODEAN PERILAKU ---

/**
 * Menerjemahkan satu baris data log menjadi satu kode perilaku.
 * @param {object} row - Objek yang merepresentasikan satu baris data dari file CSV.
 * @returns {string|null} - Kode perilaku (misal: 'DAS', 'WK_VIEW') atau null jika tidak cocok.
 */
export const assignBehaviorCode = (row) => {
  const verb = row.verb || "";
  const obj = row.object || "";
  // const session = row.session_id || ''; // Tidak digunakan di logika ini, tapi bisa ditambahkan jika perlu
  // const success = resultSuccess(row);

  // Aturan-aturan di bawah ini adalah konversi langsung dari kode Python Anda.

  // Dashboard
  if (verbIs(row, "/viewed") && objectPrefix(row, "/auth/dashboard")) {
    return "DAS";
  }

  // Week Page
  if (verbIs(row, "/viewed") && obj.includes("/auth/dashboard/course/week/") && !obj.includes("#tab")) {
    return "WK_VIEW";
  }

  // Materi
  if (obj.includes("week-page#material-button")) return "MAT_OPEN";
  if (verbIs(row, "/progressed") && obj.includes("/materials/")) return "MAT_SLIDE";
  if (verbIs(row, "/completed") && obj.includes("/materials/")) return "MAT_DONE";
  if (obj.includes("material-page#download-pdf-button") || obj.includes("download-pdf")) return "MAT_PDF";

  // Video
  if (obj.includes("watch-video-button")) return "VID";
  if (verbIs(row, "/completed") && (obj.includes("videoProgress") || contains(obj, "video", "complete"))) return "VID_DONE";

  // Quiz
  if (obj.includes("week-page#start-quiz-button") || obj.includes("quiz-page#start-modal-start-button") || (verbIs(row, "/initialized") && obj.includes("/quiz/"))) return "QUIZ_START";
  if (obj.includes("quiz-page#nav-icon") || obj.includes("quiz-page#prev-question-button") || obj.includes("quiz-page#next-question-button") || (verbIs(row, "/progressed") && obj.includes("#question-"))) return "QUIZ_NAV";
  if (verbIs(row, "/answered") && obj.includes("/quiz")) return "QUIZ_ANSWER";
  if (verbIs(row, "/completed") && obj.includes("/quiz")) return "QUIZ_SUBMIT";
  if (verbIs(row, "/failed") && obj.includes("/quiz")) return "QUIZ_TIMEOUT";

  // Coding Task Page
  if (verbIs(row, "/viewed") && obj.includes("/course/week/") && obj.includes("/task")) return "TASK_PAGE";
  if (obj.includes("task-page#select-project")) return "TASK_SELECT";
  if (verbIs(row, "/completed") && contains(obj, "assignment")) return "TASK_SUBMIT_OK";
  if (verbIs(row, "/failed") && contains(obj, "assignment")) return "TASK_SUBMIT_FAIL";
  if (obj.includes("task-page#create-workspace-button")) return "TASK_WS_CREATE";

  // Workspace Dashboard & Editor (lanjutan, disederhanakan)
  if (verbIs(row, "/launched") && obj.includes("/auth/dashboard/workspace/editor")) return "WE_ENTER";
  if (verbIs(row, "/progressed") && obj.includes("/auth/dashboard/workspace/editor/file/")) return "WE_TYPE";
  if (verbIs(row, "/interacted") && contains(obj, "ai-assist")) return "WE_AI_REQUEST";
  if (verbIs(row, "/responded") && contains(obj, "ai-assist-response")) return "WE_AI_RESPONSE";
  if (verbIs(row, "/completed") && contains(obj, "/save/quick")) return "WE_SAVE";

  // Feedback
  if ((verbIs(row, "/completed") && obj.includes("/feedback")) || obj.includes("feedback-page#submit-button")) return "FEED";
  if (verbIs(row, "/failed") && obj.includes("/feedback")) return "FEED_FAIL";

  // Jika tidak ada aturan yang cocok, kembalikan null
  return null;
};
