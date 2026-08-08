import { WorkItem } from "../types";

export function parseAadhaarReceipt(text: string): WorkItem | null {
  const upperText = text.toUpperCase();

  if (
    !upperText.includes("ENROLMENT") &&
    !upperText.includes("AADHAAR") &&
    !upperText.includes("UIDAI")
  ) {
    return null;
  }

  let name = "";
  let phone = "";
  let reference = "";
  let date = "";
  let dob = "";

  // Enrolment Number
  const enrolmentMatch = text.match(/\d{4}\/\d{5}\/\d{5}/);
  if (enrolmentMatch) {
    reference = enrolmentMatch[0];
  }

  // Receipt Date + Time
  const dateMatch = text.match(
    /Date:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4}\s+[0-9]{2}:[0-9]{2}:[0-9]{2})/i
  );
  if (dateMatch) {
    date = dateMatch[1];
  }

  // Mobile
  const mobileMatch = text.match(/\+91\s*([6-9]\d{9})/);
  if (mobileMatch) {
    phone = mobileMatch[1];
  }

  // DOB
  const dobMatch = text.match(
    /Date\s*Of\s*Birth:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i
  );
  if (dobMatch) {
    dob = dobMatch[1];
  }

  // Name
  const lines = text
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  const appointmentIndex = lines.findIndex((x) =>
    x.includes("Appointment No")
  );

  if (appointmentIndex !== -1 && lines[appointmentIndex + 1]) {
    name = lines[appointmentIndex + 1]
      .replace(/\[.*?\]/g, "")
      .trim();
  }

  console.log({
    name,
    dob,
    phone,
    reference,
    date,
  });

  return {
    id: crypto.randomUUID(),
    service: "Aadhaar",
    name,
    phone,
    reference,
    date,
    dob,
    staff: "Current User",
    status: "Pending",
  };
}