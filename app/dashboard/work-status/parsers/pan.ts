import type { WorkItem } from "../types";
export function parsePanReceipt(text: string): WorkItem | null {
  const upperText = text.toUpperCase();
  console.log(text);

  if (
    !upperText.includes("PAN") &&
    !upperText.includes("COUPON") &&
    !upperText.includes("ACKNOWLEDGEMENT") &&
    !upperText.includes("APPLICATION")
  ) {
    return null;
  }

  let name = "";
  let mobile = "";
  let couponNumber = "";
  let date = "";

  // 1. Coupon / Application Number Match (Keeps the hyphen intact e.g., U-R017279747)
  const couponMatch = text.match(/\b(U-?R\d{7,})\b/i) || 
                      text.match(/Application\s*No\.?\/Coupon\s*No\.?\s*([A-Z0-9\-]+)/i);

  if (couponMatch) {
    couponNumber = (couponMatch[1] || couponMatch[0])
      .toUpperCase()
      .trim();
  }

  // 2. Strict Date Match: Explicitly look for Date of Incorporation or Date of Birth
  const specificDateMatch = text.match(
    /Date\s+of\s+Incorporation\s*([0-9\/]{8,10})/i
  );
  
  if (specificDateMatch) {
    let rawDate = specificDateMatch[1].replace(/\D/g, "");

    if (rawDate.length === 8) {
      date =
        rawDate.slice(0, 2) +
        "/" +
        rawDate.slice(2, 4) +
        "/" +
        rawDate.slice(4);
    }
  } else {
    // Find all dates in the text and filter out any receipt or payment dates (e.g., 06/06/2026)
    const dateMatches = text.matchAll(/\b([0-9]{2}[\/\-][0-9]{2}[\/\-][0-9]{4})\b/g);
    const dates = Array.from(dateMatches, m => m[1]);
    
    // Filter out 06/06/2026 or current receipt generation dates
    const validDates = dates.filter(d => d !== "06/06/2026" && !d.startsWith("06/06"));
    
    if (validDates.length > 0) {
      date = validDates[0];
    } else if (dates.length > 0) {
      date = dates.find(d => d !== "06/06/2026") || dates[0];
    }
  }

  // 3. Mobile Number Match
  const mobileMatch = text.match(/\b([6-9]\d{9})\b/);
  if (mobileMatch) {
    mobile = mobileMatch[1];
  }

  // 4. Name Match
  const nameMatch = text.match(
    /(?:from\s+|Trust\)\s*\n?)([\s\S]*?)(?:\s+Application\s+No|\s+Date of Incorporation|$)/i
  ) || text.match(/(?:Received Rs\.[^\n]*from\s*\n?)([\s\S]*?)(?:\s+Application\s+No|$)/i);

  if (nameMatch) {
    name = nameMatch[1].replace(/\n/g, " ").trim();
  } else {
    const fallbackName = text.match(/(?:[0-9]+\/[-\s]*from\s*)?([A-Z\s\-]{5,}(?:TRUST|FOUNDATION|LTD|PVT|LIMITED))\b/i);
    if (fallbackName) {
      name = fallbackName[1].trim();
    }
  }

  console.log("OCR TEXT PARSED:", {
    name,
    mobile,
    couponNumber,
    date,
  });

const item: WorkItem = {
  id: crypto.randomUUID(),
  service: "PAN",
  name,
  phone: mobile,
  reference: couponNumber || "N/A",
  date: date || "N/A",
  staff: "Current User",
  status: "Pending",
};

return item;
}