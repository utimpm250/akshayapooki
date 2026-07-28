// components/SummaryHelpers.ts

import { BillRecord, Summary } from "./types";
import { PerformanceRecord } from "../types";

export const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const getDate = (value: any) =>
  new Date(
    value?.timestamp ??
      value?.created_at ??
      value?.createdAt ??
      value?.date ??
      Date.now()
  );

export const matchesStaff = (
  selectedStaff: string,
  staffName?: string
) =>
  selectedStaff === "All" ||
  (staffName || "").toLowerCase() ===
    selectedStaff.toLowerCase();

export const getCredit = (rows: BillRecord[]) =>
  rows.reduce((sum, row: any) => {
    const amount =
      Number(row.credit) ||
      Number(row.owedAmount) ||
      Number(row.pendingAmount) ||
      Number(row.balance) ||
      0;

    return sum + amount;
  }, 0);

export const createSummary = (
  rows: PerformanceRecord[],
  credit: number
): Summary => {
  const deptFee = rows.reduce(
    (sum, row) =>
      sum + Number(row.departmentFee || 0),
    0
  );

  const serviceCharge = rows.reduce(
    (sum, row) =>
      sum + Number(row.serviceCharge || 0),
    0
  );

  const totalCash = rows.reduce(
    (sum, row) =>
      sum + Number(row.totalAmount || 0),
    0
  );

  return {
    services: rows.length,
    deptFee,
    serviceCharge,
    credit,
    totalCash,
  };
};

export const calculateMonthlySalary = (
  serviceCharge: number,
  basicSalary: number
) => {
  const profit = Math.max(
    serviceCharge - basicSalary,
    0
  );

  const bonus = profit * 0.05;

  return {
    profit,
    bonus,
    finalSalary: basicSalary + bonus,
  };
};

export const calculateYearlySalary = (
  yearlyServiceCharge: number,
  basicSalary: number
) => {
  const yearlySalary = basicSalary * 12;

  const yearlyProfit = Math.max(
    yearlyServiceCharge - yearlySalary,
    0
  );

  const yearlyBonus = yearlyProfit * 0.05;

  return {
    yearlySalary,
    yearlyProfit,
    yearlyBonus,
    finalSalary:
      yearlySalary + yearlyBonus,
  };
};