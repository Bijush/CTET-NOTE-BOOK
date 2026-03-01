// utils/trap_detector.js

import { examTraps } from "../data/exam_traps.js";

/* ===================================
   🧠 Detect CTET Exam Traps — EXPERT
   ✔ Single word safe
   ✔ Multi-word safe
   ✔ Bengali + English
   ✔ Substring protected
=================================== */
export function detectTraps(text = "", subject = "") {

  /* ==============================
     🚫 Safety Check
  ============================== */
  if (!text) return [];

  /* ==============================
     1️⃣ Normalize Input Text
  ============================== */
  const normalizedText = normalizeText(text);

  /* ==============================
     2️⃣ Collect Trap Lists
  ============================== */
  const globalTraps =
    examTraps.GLOBAL || [];

  const subjectTraps =
    examTraps[subject] || [];

  const allTraps = [
    ...globalTraps,
    ...subjectTraps
  ];

  /* ==============================
     3️⃣ Detection Engine
  ============================== */
  const foundSet = new Set();

  for (const rawWord of allTraps) {

    if (!rawWord) continue;

    const trapWord =
      normalizeText(rawWord);

    const escaped =
      escapeRegex(trapWord);

    // Word / Phrase Boundary Regex
    const regex =
      new RegExp(`\\b${escaped}\\b`, "i");

    if (regex.test(normalizedText)) {
      foundSet.add(rawWord);
    }

  }

  /* ==============================
     4️⃣ Return Unique Matches
  ============================== */
  return Array.from(foundSet);
}



/* ===================================
   🔧 HELPER FUNCTIONS
   (Same File — Option 1)
=================================== */

/* Normalize Text
   ✔ Lowercase
   ✔ Remove extra spaces
*/
function normalizeText(text) {

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}


/* Escape Regex Special Characters
   Prevent regex errors
*/
function escapeRegex(text) {

  return text.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}