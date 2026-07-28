// components/SummaryCards.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";

import { PerformanceRecord } from "../types";

import DailyCard from "./DailyCard";
import MonthlyCard from "./MonthlyCard";
import YearlyCard from "./YearlyCard";

import {
  BillRecord,
  StaffRecord,
} from "./types";

import {
  getDate,
  getCredit,
  matchesStaff,
  createSummary,
  calculateMonthlySalary,
  calculateYearlySalary,
} from "./SummaryHelpers";

interface SummaryCardsProps {
  records: PerformanceRecord[];
  attendanceLogs: any[];
  selectedStaff: string;

  dailyDate: Date;
  setDailyDate: React.Dispatch<
    React.SetStateAction<Date>
  >;

  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: React.Dispatch<
    React.SetStateAction<number>
  >;
  setSelectedYear: React.Dispatch<
    React.SetStateAction<number>
  >;

  yearlyYear: number;
  setYearlyYear: React.Dispatch<
    React.SetStateAction<number>
  >;
}

export default function SummaryCards({
  records,
  selectedStaff,

  dailyDate,
  setDailyDate,

  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,

  yearlyYear,
  setYearlyYear,
}: SummaryCardsProps) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [billRecords, setBillRecords] =
    useState<BillRecord[]>([]);

  const [staffRecords, setStaffRecords] =
    useState<StaffRecord[]>([]);

  useEffect(() => {
    try {
      const bills = JSON.parse(
        localStorage.getItem(
          "smart_akshaya_bills"
        ) || "[]"
      );

      const staff = JSON.parse(
        localStorage.getItem(
          "smart_akshaya_staff"
        ) || "[]"
      );

      setBillRecords(
        Array.isArray(bills) ? bills : []
      );

      setStaffRecords(
        Array.isArray(staff) ? staff : []
      );
    } catch {
      setBillRecords([]);
      setStaffRecords([]);
    }
  }, []);

  const dailyRecords = useMemo(
    () =>
      records.filter((record) => {
        const date = getDate(record);

        return (
          matchesStaff(
            selectedStaff,
            record.staffName
          ) &&
          date.getDate() ===
            dailyDate.getDate() &&
          date.getMonth() ===
            dailyDate.getMonth() &&
          date.getFullYear() ===
            dailyDate.getFullYear()
        );
      }),
    [records, selectedStaff, dailyDate]
  );

  const monthlyRecords = useMemo(
    () =>
      records.filter((record) => {
        const date = getDate(record);

        return (
          matchesStaff(
            selectedStaff,
            record.staffName
          ) &&
          date.getMonth() ===
            selectedMonth &&
          date.getFullYear() ===
            selectedYear
        );
      }),
    [
      records,
      selectedMonth,
      selectedYear,
      selectedStaff,
    ]
  );

  const yearlyRecords = useMemo(
    () =>
      records.filter((record) => {
        const date = getDate(record);

        return (
          matchesStaff(
            selectedStaff,
            record.staffName
          ) &&
          date.getFullYear() ===
            yearlyYear
        );
      }),
    [
      records,
      yearlyYear,
      selectedStaff,
    ]
  );

  const dailyBills = useMemo(
    () =>
      billRecords.filter((bill) => {
        const date = getDate(bill);

        return (
          matchesStaff(
            selectedStaff,
            bill.staffName ||
              bill.staff
          ) &&
          date.getDate() ===
            dailyDate.getDate() &&
          date.getMonth() ===
            dailyDate.getMonth() &&
          date.getFullYear() ===
            dailyDate.getFullYear()
        );
      }),
    [
      billRecords,
      dailyDate,
      selectedStaff,
    ]
  );

  const monthlyBills = useMemo(
    () =>
      billRecords.filter((bill) => {
        const date = getDate(bill);

        return (
          matchesStaff(
            selectedStaff,
            bill.staffName ||
              bill.staff
          ) &&
          date.getMonth() ===
            selectedMonth &&
          date.getFullYear() ===
            selectedYear
        );
      }),
    [
      billRecords,
      selectedMonth,
      selectedYear,
      selectedStaff,
    ]
  );

  const yearlyBills = useMemo(
    () =>
      billRecords.filter((bill) => {
        const date = getDate(bill);

        return (
          matchesStaff(
            selectedStaff,
            bill.staffName ||
              bill.staff
          ) &&
          date.getFullYear() ===
            yearlyYear
        );
      }),
    [
      billRecords,
      yearlyYear,
      selectedStaff,
    ]
  );
console.log({
  selectedStaff,
  dailyBills,
  monthlyBills,
  yearlyBills,
});
  const staff = useMemo(
    () =>
      staffRecords.find((row) =>
        matchesStaff(
          selectedStaff,
          row.staffName || row.name
        )
      ),
    [staffRecords, selectedStaff]
  );

  const basicSalary = Number(
    staff?.salary || 0
  );

  const daily = createSummary(
    dailyRecords,
    getCredit(dailyBills)
  );

  const monthly = createSummary(
    monthlyRecords,
    getCredit(monthlyBills)
  );

  const yearly = createSummary(
    yearlyRecords,
    getCredit(yearlyBills)
  );

  const {
    bonus: monthlyBonus,
    finalSalary: finalMonthlySalary,
  } = calculateMonthlySalary(
    monthly.serviceCharge,
    basicSalary
  );

  const {
    yearlySalary,
    yearlyBonus,
    finalSalary: finalYearlySalary,
  } = calculateYearlySalary(
    yearly.serviceCharge,
    basicSalary
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <DailyCard
        daily={daily}
        dailyDate={dailyDate}
        setDailyDate={setDailyDate}
      />

      <MonthlyCard
        monthly={monthly}
        monthNames={monthNames}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={
          setSelectedMonth
        }
        setSelectedYear={
          setSelectedYear
        }
        basicSalary={basicSalary}
        monthlyBonus={monthlyBonus}
        finalMonthlySalary={
          finalMonthlySalary
        }
      />

      <YearlyCard
        yearly={yearly}
        yearlyYear={yearlyYear}
        setYearlyYear={
          setYearlyYear
        }
        yearlySalary={yearlySalary}
        yearlyBonus={yearlyBonus}
        finalYearlySalary={
          finalYearlySalary
        }
      />
    </div>
  );
}