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
 * Memeriksa apakah 'verb' cocok dengan salah satu suffix (case-insensitive).
 * Bisa menerima nilai spesifik menggunakan prefix "exact:".
 * @param {object} row
 * @param  {...string} targets
 * @returns {boolean}
 */
const verbMatches = (row, ...targets) => {
  const v = typeof row.verb === "string" ? row.verb.toLowerCase() : "";
  if (!v) return false;
  return targets.some((target) => {
    if (!target) return false;
    const normalized = target.toLowerCase();
    if (normalized.startsWith("exact:")) {
      return v === normalized.slice(6);
    }
    return v.endsWith(normalized);
  });
};

/**
 * Memeriksa apakah 'object' mengandung seluruh token yang diberikan.
 * @param {object} row
 * @param  {...string} tokens
 * @returns {boolean}
 */
const objectContains = (row, ...tokens) => contains(row.object || "", ...tokens);

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
  if (verbMatches(row, "/viewed", "/launched") && objectContains(row, "/auth/dashboard") && !objectContains(row, "/auth/dashboard/course/week/")) {
    return "DAS";
  }

  // Week Page
  if (verbMatches(row, "/viewed", "/launched") && objectContains(row, "/auth/dashboard/course/week/") && !objectContains(row, "#tab")) {
    return "WK_VIEW";
  }

  // Materi
  if (obj.includes("week-page#material-button")) return "MAT_OPEN";
  if (verbIs(row, "/progressed") && obj.includes("/materials/")) return "MAT_SLIDE";
  if (verbIs(row, "/completed") && obj.includes("/materials/")) return "MAT_DONE";
  if (obj.includes("material-page#download-pdf-button") || obj.includes("download-pdf")) return "MAT_PDF";

  // Video
  if (objectContains(row, "watch-video-button")) return "VID";
  if (verbMatches(row, "/completed", "/terminated", "/passed") && (objectContains(row, "video-progress", "complete") || contains(obj, "video", "complete"))) return "VID_DONE";

  // Quiz
  if (obj.includes("week-page#start-quiz-button") || obj.includes("quiz-page#start-modal-start-button") || (verbIs(row, "/initialized") && obj.includes("/quiz/"))) return "QUIZ_START";
  if (obj.includes("quiz-page#nav-icon") || obj.includes("quiz-page#prev-question-button") || obj.includes("quiz-page#next-question-button") || (verbIs(row, "/progressed") && obj.includes("#question-"))) return "QUIZ_NAV";
  if (verbMatches(row, "/answered", "/responded", "/submitted") && objectContains(row, "/quiz")) return "QUIZ_ANSWER";
  if (verbMatches(row, "/completed", "/passed", "/submitted") && objectContains(row, "/quiz")) return "QUIZ_SUBMIT";
  if (verbMatches(row, "/failed", "/terminated", "/abandoned") && objectContains(row, "/quiz")) return "QUIZ_TIMEOUT";

  // Coding Task Page
  if (verbMatches(row, "/viewed", "/launched") && objectContains(row, "/course/week/", "/task")) return "TASK_PAGE";
  if (obj.includes("task-page#select-project")) return "TASK_SELECT";
  if (verbMatches(row, "/completed", "/passed") && (objectContains(row, "task-week") || contains(obj, "assignment") || objectContains(row, "/task/question"))) return "TASK_SUBMIT_OK";
  if (verbMatches(row, "/failed") && (objectContains(row, "task-week") || contains(obj, "assignment") || objectContains(row, "/task/question"))) return "TASK_SUBMIT_FAIL";
  if (obj.includes("task-page#create-workspace-button")) return "TASK_WS_CREATE";

  // Workspace Dashboard & Editor (lanjutan, disederhanakan)
  if (verbMatches(row, "/launched", "/initialized") && objectContains(row, "/auth/dashboard/workspace/editor")) return "WE_ENTER";
  if (verbMatches(row, "/progressed", "/updated") && objectContains(row, "/auth/dashboard/workspace/editor/file/")) return "WE_TYPE";
  if (verbMatches(row, "/interacted", "/requested") && contains(obj, "ai-assist")) return "WE_AI_REQUEST";
  if (verbMatches(row, "/responded", "/receive", "/received") && contains(obj, "ai-assist-response")) return "WE_AI_RESPONSE";
  if (verbMatches(row, "/completed", "/saved") && contains(obj, "/save/quick")) return "WE_SAVE";

  // Feedback
  if ((verbMatches(row, "/completed", "/submitted") && objectContains(row, "/feedback")) || obj.includes("feedback-page#submit-button")) return "FEED";
  if (verbMatches(row, "/failed") && objectContains(row, "/feedback")) return "FEED_FAIL";

  // Jika tidak ada aturan yang cocok, kembalikan null
  return null;
};
