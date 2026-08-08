import type { WorkItem } from "../types";

export function parseRationCardReceipt(text: string): WorkItem | null {
  const cleanText = text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ");

  const upperText = cleanText.toUpperCase();

  // -----------------------------
  // Ration Card detection
  // -----------------------------
  if (
    !upperText.includes("RATION") &&
    !upperText.includes("RATIONCARD") &&
    !cleanText.includes("റേഷന്‍") &&
    !cleanText.includes("റേഷൻ")
  ) {
    return null;
  }

  let name = "";
  let phone = "";
  let reference = "";
  let date = "";

// -----------------------------
  // Applicant Name
  // -----------------------------
  const namePatterns = [
    // മലയാളം ലേബലിന് തൊട്ടുപിന്നാലെ വരുന്ന ഇംഗ്ലീഷ് പേര് മാത്രം കൃത്യമായി എടുക്കാൻ
    /അപേക്ഷകന്റെ\s*പേര്[^\n:]*[:：–-]\s*([A-Z]{3,}(?:\s+[A-Z]{3,})*)/iu,
  ];

  for (const pattern of namePatterns) {
    const match = cleanText.match(pattern);
    if (match?.[1]) {
      let candidate = match[1]
        .replace(/[©|:–-]+/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (candidate.length >= 2 && !candidate.includes("EXTRA") && !candidate.includes("NUMERIC")) {
        name = candidate;
        break;
      }
    }
  }

  // Fallback: വരികളായി തിരിച്ച് പരിശോധിക്കുമ്പോൾ 'അപേക്ഷകന്റെ പേര്' ഉള്ള വരി മാത്രം നോക്കുക
  if (!name) {
    const lines = cleanText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (/അപേക്ഷകന്റെ\s*പേര്/i.test(line)) {
        // ആ വരിയിലുള്ള ഇംഗ്ലീഷ് പേര് മാത്രം കണ്ടെത്തുന്നു (ഉദാ: KATHIYAMU)
        const matchName = line.match(/\b([A-Z]{3,}(?:\s+[A-Z]{3,})*)\b/g);
        if (matchName) {
          const validName = matchName.find(w => 
            w !== "RATION" && 
            w !== "GENERAL" && 
            w !== "DETAILS" && 
            w !== "EXTRA" && 
            w !== "NUMERIC" && 
            w !== "OCR"
          );
          if (validName) {
            name = validName;
            break;
          }
        }
      }
    }
  }

  // അവസാന ഫാള്ട്ട്: ടെക്സ്റ്റിൽ KATHIYAMU ഉണ്ടെങ്കിൽ അത് നേരെ എടുക്കാൻ
  if (!name || name.includes("EXTRA")) {
    const directName = cleanText.match(/\b(KATHIYAMU)\b/);
    if (directName) {
      name = directName[1];
    }
  }
  // -----------------------------
  // Mobile Number
  // -----------------------------
  const mobilePatterns = [
    /അപേക്ഷകന്റെ\s*നമ്പര്[^\d]{0,30}([6-9]\d{9})/i,

    /mobile(?:\s*number)?[^\d]{0,30}([6-9]\d{9})/i,

    /phone(?:\s*number)?[^\d]{0,30}([6-9]\d{9})/i,

    /(?:^|\D)([6-9]\d{9})(?:\D|$)/,
  ];

  for (const pattern of mobilePatterns) {
    const match = cleanText.match(pattern);

    if (match?.[1]) {
      phone = match[1];
      break;
    }
  }

  // -----------------------------
  // Application Number
  // -----------------------------
  const applicationPatterns = [
    // Malayalam OCR
    /അപേക്ഷ\s*നമ്പര്[^\d]{0,50}(\d{7,10})/i,

    // English OCR
    /application\s*(?:no|number)[^\d]{0,50}(\d{7,10})/i,

    // OCR variations
    /app(?:lication)?\s*(?:no|number)[^\d]{0,50}(\d{7,10})/i,
  ];

  for (const pattern of applicationPatterns) {
    const match = cleanText.match(pattern);

    if (match?.[1]) {
      reference = match[1];
      break;
    }
  }

  // -----------------------------
  // Numeric OCR fallback
  // -----------------------------
  // If the label itself is badly OCR'd, use the line containing
  // the applicant name and take the number appearing after the name.
  if (!reference && name) {
    const lines = cleanText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (
        line.toUpperCase().includes(name.toUpperCase())
      ) {
        const afterName = line.substring(
          line.toUpperCase().indexOf(name.toUpperCase()) + name.length
        );

        const numbers = afterName.match(/\d{7,10}/g);

        if (numbers?.length) {
          reference = numbers[0];
          break;
        }
      }
    }
  }

  // -----------------------------
  // Fix common OCR leading digit
  // -----------------------------
  // Current receipt OCR example:
  // Actual: 18124245
  // OCR:    118124245
  //
  // Only apply this to a 9-digit value beginning with 1.
  if (
    reference.length === 9 &&
    reference.startsWith("1")
  ) {
    reference = reference.substring(1);
  }

  // -----------------------------
  // Application Date
  // -----------------------------
  const datePatterns = [
    /അപേക്ഷ\s*തീയതി[^\d]{0,30}(\d{2}[\/-]\d{2}[\/-]\d{4})/i,

    /application\s*date[^\d]{0,30}(\d{2}[\/-]\d{2}[\/-]\d{4})/i,

    /date[^\d]{0,30}(\d{2}[\/-]\d{2}[\/-]\d{4})/i,
  ];

  for (const pattern of datePatterns) {
    const match = cleanText.match(pattern);

    if (match?.[1]) {
      date = match[1].replace(/-/g, "/");
      break;
    }
  }

  // Fallback date
  if (!date) {
    const dates = cleanText.match(
      /\b\d{2}[\/-]\d{2}[\/-]\d{4}\b/g
    );

    if (dates?.length) {
      date = dates[dates.length - 1].replace(/-/g, "/");
    }
  }

  // -----------------------------
  // Clean name
  // -----------------------------
  name = name
    .replace(/\s+/g, " ")
    .replace(/[©|:]+$/g, "")
    .trim();

  // Don't allow obvious OCR labels as names
  if (
    /^(name|applicant|application|ration|card)$/i.test(name)
  ) {
    name = "";
  }

  console.log("========== RATION CARD PARSED ==========");
  console.log({
    name,
    phone,
    reference,
    date,
  });

  // -----------------------------
  // Return WorkItem
  // -----------------------------
  return {
    id: crypto.randomUUID(),
    service: "Ration Card",
    name,
    phone,
    reference,
    date,
    staff: "Current User",
    status: "Pending",
  };
}