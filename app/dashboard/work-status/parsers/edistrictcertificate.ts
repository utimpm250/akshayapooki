import type { WorkItem } from "../types";

export function parseEdistrictCertificateReceipt(
  text: string
): WorkItem | null {
  const upperText = text.toUpperCase();

  // Detect Kerala e-District receipt
  if (
    !upperText.includes("GOVERNMENT OF KERALA") &&
    !upperText.includes("APPLICATION NO") &&
    !upperText.includes("REGISTRATION NO") &&
    !upperText.includes("TRANSACTION")
  ) {
    return null;
  }

  const cleanText = text
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .trim();

  const oneLine = cleanText.replace(/\s+/g, " ");

  let name = "";
  let applicationNo = "";
  let registrationNo = "";
  let date = "";
  let service = "";

  // =========================================================
  // DATE
  // =========================================================

  const dateMatch =
    oneLine.match(
      /\bDate\s*[:\-]?\s*(\d{2}\s*[\/\-]\s*\d{2}\s*[\/\-]\s*\d{4})/i
    ) ||
    oneLine.match(
      /\bDate\s*[:\-]?\s*(\d{2}\s*[\/\-]\s*\d{2}\s*[\/\-]\s*\d{4})/i
    );

  if (dateMatch) {
    date = dateMatch[1]
      .replace(/\s/g, "")
      .replace(/-/g, "/");
  }

  // =========================================================
  // APPLICATION NUMBER
  // Handles:
  // Application No : 112144216
  // Application No 112144216
  // Appl.No : 112144216
  // =========================================================

  const applicationMatch =
    oneLine.match(
      /Application\s*(?:No|Number)\.?\s*[:\-]?\s*([0-9]{6,15})/i
    ) ||
    oneLine.match(
      /Appl\.?\s*No\.?\s*[:\-]?\s*([0-9]{6,15})/i
    ) ||
    oneLine.match(
      /Application\s*No\s*[:\-]?\s*[^0-9]{0,10}([0-9]{6,15})/i
    );

  if (applicationMatch) {
    applicationNo = applicationMatch[1];
  }

  // =========================================================
  // REGISTRATION NUMBER
  // Handles:
  // Registration No : 57813993
  // Reg. No. : 57813993
  // =========================================================

  const registrationMatch =
    oneLine.match(
      /Registration\s*(?:No|Number)\.?\s*[:\-]?\s*([0-9]{6,15})/i
    ) ||
    oneLine.match(
      /Reg\.?\s*No\.?\s*[:\-]?\s*([0-9]{6,15})/i
    );

  if (registrationMatch) {
    registrationNo = registrationMatch[1];
  }

  // =========================================================
  // SERVICE
  // =========================================================

  if (/Non[-\s]?Creamy\s+Layer\s+Certificate/i.test(oneLine)) {
    service = "Non-Creamy Layer Certificate";
  } else if (/Income\s+Certificate/i.test(oneLine)) {
    service = "Income Certificate";
  } else {
    const transactionMatch = oneLine.match(
      /Transaction\s*[:\-]?\s*(.+?)(?=\s+(?:Registration|Reg\.?|Application|Appl\.?|Tentative|Receipt|Amount|Date)\b|$)/i
    );

    if (transactionMatch) {
      service = transactionMatch[1]
        .replace(/\s+/g, " ")
        .trim();
    }
  }

// =========================================================
// NAME
// =========================================================

const namePatterns = [
  // Name : HRIDHYA K
  // Name : MAMMATHUTTY
  /\bName\s*[:\-iIl|]?\s*([A-Za-z][A-Za-z .'-]*?)(?=\s+(?:Nome|Department|Dept|Transaction|Registration|Reg|Application|Appl|Tentative|Receipt|Date|Amount)\b|$)/i,

  // OCR: Nome MAMMATHUTTY
  /\bNome\s*[:\-iIl|]?\s*([A-Za-z][A-Za-z .'-]*?)(?=\s+(?:Name|Department|Dept|Transaction|Registration|Reg|Application|Appl|Tentative|Receipt|Date|Amount)\b|$)/i,
];

for (const pattern of namePatterns) {
  const match = oneLine.match(pattern);

  if (match?.[1]) {
    const candidate = match[1]
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^[^A-Za-z]+/, "")
      .replace(/[^A-Za-z .'-]+$/, "")
      .trim();

    if (
      candidate &&
      candidate.length >= 2 &&
      !/^(Name|Nome|Department|Dept|Transaction|Registration|Reg|Application|Appl|Tentative|Receipt|Date|Amount)$/i.test(
        candidate
      )
    ) {
      name = candidate;
      break;
    }
  }
}

// =========================================================
// LINE-BY-LINE FALLBACK
// =========================================================

if (!name) {
  const lines = cleanText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const match = line.match(
      /(?:Name|Nome)\s*[:\-iIl|]?\s*([A-Za-z][A-Za-z .'-]*?)(?=\s+(?:Nome|Name|Department|Dept|Transaction|Registration|Reg|Application|Appl|Tentative|Receipt|Date|Amount)\b|$)/i
    );

    if (match?.[1]) {
      name = match[1]
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^[^A-Za-z]+/, "")
        .replace(/[^A-Za-z .'-]+$/, "")
        .trim();

      if (name) break;
    }
  }
}

// =========================================================
// FINAL NAME CLEANUP
// =========================================================

name = name
  .replace(/\s+/g, " ")
  .trim();
  // =========================================================
  // DEBUG
  // =========================================================

  console.log("========== E-DISTRICT PARSED ==========");
  console.log({
    name,
    applicationNo,
    registrationNo,
    date,
    service,
  });
  console.log("=======================================");

  // =========================================================
  // RETURN
  // =========================================================

  return {
    id: crypto.randomUUID(),
    service: service || "e-District Certificate",
    name: name || "Unknown Name",
    phone: "",
    reference: applicationNo || "N/A",
    registrationNo: registrationNo || "",
    date: date || "N/A",
    staff: "Current User",
    status: "Pending",
  };
}