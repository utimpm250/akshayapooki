import {
  PerformanceRecord,
  Holiday,
  PendingBill,
  SalaryHistory,
} from "./types";

export const STORAGE_KEYS = {
  RECORDS: "performanceRecords",
  PENDING_BILLS: "pendingBills",
  HOLIDAYS: "holidays",
  SALARY_HISTORY: "salaryHistory",
};

export function loadPerformanceRecords(): PerformanceRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function loadPendingBills(): PendingBill[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_BILLS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function loadHolidays(): Holiday[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function loadSalaryHistory(): SalaryHistory[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.SALARY_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePerformanceRecords(
  records: PerformanceRecord[]
) {
  localStorage.setItem(
    STORAGE_KEYS.RECORDS,
    JSON.stringify(records)
  );
}

export function savePendingBills(
  bills: PendingBill[]
) {
  localStorage.setItem(
    STORAGE_KEYS.PENDING_BILLS,
    JSON.stringify(bills)
  );
}

export function saveSalaryHistory(
  history: SalaryHistory[]
) {
  localStorage.setItem(
    STORAGE_KEYS.SALARY_HISTORY,
    JSON.stringify(history)
  );
}

export function saveHolidays(
  holidays: Holiday[]
) {
  localStorage.setItem(
    STORAGE_KEYS.HOLIDAYS,
    JSON.stringify(holidays)
  );
}
export function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function isSameDate(
  date1: Date,
  date2: Date
) {
  return formatDate(date1) === formatDate(date2);
}

export function getAttendanceRecord(
  records: PerformanceRecord[],
  date: Date
) {
  return records.find(
    (record) => record.date === formatDate(date)
  );
}

export function getHoliday(
  holidays: Holiday[],
  date: Date
) {
  return holidays.find(
    (holiday) => holiday.date === formatDate(date)
  );
}

export function getMonthlyRecords(
  records: PerformanceRecord[],
  month: number,
  year: number,
  staff?: string
) {
  return records.filter((record) => {
    const recordDate = new Date(record.date);

    const matchesStaff =
      !staff ||
      staff === "All" ||
      record.staffName?.toLowerCase() ===
        staff.toLowerCase();

    return (
      matchesStaff &&
      recordDate.getMonth() === month &&
      recordDate.getFullYear() === year
    );
  });
}

export function getYearlyRecords(
  records: PerformanceRecord[],
  year: number,
  staff?: string
) {
  return records.filter((record) => {
    const recordDate = new Date(record.date);

    const matchesStaff =
      !staff ||
      staff === "All" ||
      record.staffName?.toLowerCase() ===
        staff.toLowerCase();

    return (
      matchesStaff &&
      recordDate.getFullYear() === year
    );
  });
}

export function calculateTotal<T>(
  items: T[],
  selector: (item: T) => number
) {
  return items.reduce(
    (sum, item) => sum + selector(item),
    0
  );
}
export function getPresentDays(
  records: PerformanceRecord[]
) {
  return records.length;
}

export function getAbsentDays(
  records: PerformanceRecord[],
  month: number,
  year: number
) {
  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();

  return Math.max(
    totalDays - records.length,
    0
  );
}

export function sortByLatest<T extends { date: string }>(
  items: T[]
) {
  return [...items].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );
}

export function sortSalaryHistory(
  history: SalaryHistory[]
) {
  return [...history].sort(
    (a, b) =>
      new Date(b.paymentDate).getTime() -
      new Date(a.paymentDate).getTime()
  );
}

export function getUniqueStaff(
  records: PerformanceRecord[]
) {
  return [
    "All",
    ...new Set(
      records
        .map((r) => r.staffName)
        .filter(Boolean)
    ),
  ];
}

export function currency(
  value: number
) {
  return Number(value || 0).toFixed(2);
}

export function number(
  value: number
) {
  return Number(value || 0);
}