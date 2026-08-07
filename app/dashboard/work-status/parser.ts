import type { WorkItem } from "./types";
import { parsePanReceipt } from "./parsers/pan";
export function extractWorkData(text: string): WorkItem | null {
  const pan = parsePanReceipt(text);

if (pan) {
  return pan;
}
  const cleanText = text.replace(/\r/g, "");

  const enrollmentMatch =
    cleanText.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);

  const phoneMatch =
    cleanText.match(/\b[6-9]\d{9}\b/);

  const dateMatch =
    cleanText.match(
      /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/
    );

  const nameMatch =
    cleanText.match(/Name\s*[:\-]?\s*(.+)/i);

  if (!enrollmentMatch) return null;

const loggedUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("loggedInUser") || "{}")
    : {};

return {
  id: crypto.randomUUID(),
  service: "Unknown Service",
  name: nameMatch?.[1]?.trim() || "",
  phone: phoneMatch?.[0] || "",
  reference: enrollmentMatch[0],
  date: dateMatch?.[0] || "",
  staff: loggedUser.username || "",
  addedBy: loggedUser.username || "",
  receiptUrl: "",
  receiptType: "image",
  status: "Pending",
};
}