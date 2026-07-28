"use client";

import React from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { PerformanceRecord } from "../types";

interface SummaryCardsProps {
  records: PerformanceRecord[];
  attendanceLogs: any[];
  selectedStaff: string;

  // Daily
  dailyDate: Date;
  setDailyDate: React.Dispatch<
    React.SetStateAction<Date>
  >;

  // Monthly
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: React.Dispatch<
    React.SetStateAction<number>
  >;
  setSelectedYear: React.Dispatch<
    React.SetStateAction<number>
  >;

  // Yearly
  yearlyYear: number;
  setYearlyYear: React.Dispatch<
    React.SetStateAction<number>
  >;
}

export default function SummaryCards({
  records,
  attendanceLogs,
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

  /* ======================================================
     DAILY SUMMARY
  ====================================================== */

  const cardDailyRecords = records.filter(
    (record) => {

      const matchesStaff =
        selectedStaff === "All" ||
        record.staffName?.toLowerCase() ===
          selectedStaff.toLowerCase();

      const date = new Date(
        record.timestamp
      );

      return (
        matchesStaff &&
        date.getDate() ===
          dailyDate.getDate() &&
        date.getMonth() ===
          dailyDate.getMonth() &&
        date.getFullYear() ===
          dailyDate.getFullYear()
      );

    }
  );

  const dailyServicesCount =
    cardDailyRecords.length;

  const dailyDeptFee =
    cardDailyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.departmentFee || 0),
      0
    );
      const dailyServiceCharge =
    cardDailyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.serviceCharge || 0),
      0
    );

  const dailyGpayUpi =
    cardDailyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.gpayUpiAmount || 0),
      0
    );

  const dailyOpeningBal =
    cardDailyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.openingBalance || 0),
      0
    );

  const dailyTotalCash =
    cardDailyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.totalAmount || 0),
      0
    );

  const dailyCommission =
    cardDailyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.commission || 0),
      0
    );

  /* ======================================================
     MONTHLY SUMMARY
  ====================================================== */

  const cardMonthlyRecords =
    records.filter((record) => {

      const matchesStaff =
        selectedStaff === "All" ||
        record.staffName?.toLowerCase() ===
          selectedStaff.toLowerCase();

      const date = new Date(
        record.timestamp
      );

      return (
        matchesStaff &&
        date.getMonth() ===
          selectedMonth &&
        date.getFullYear() ===
          selectedYear
      );

    });

  const monthlyServicesCount =
    cardMonthlyRecords.length;

  const monthlyDeptFee =
    cardMonthlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.departmentFee || 0),
      0
    );

  const monthlyServiceCharge =
    cardMonthlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.serviceCharge || 0),
      0
    );

  const monthlyCash =
    cardMonthlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.totalAmount || 0),
      0
    );

  const monthlyCommission =
    cardMonthlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.commission || 0),
      0
    );
      const monthlyAttendanceLogs =
    attendanceLogs.filter((log) => {

      const date = new Date(
        log.date ||
          log.loginTime ||
          log.timestamp
      );

      return (
        date.getMonth() ===
          selectedMonth &&
        date.getFullYear() ===
          selectedYear
      );

    });

  const monthlyPresentDays =
    monthlyAttendanceLogs.filter(
      (log) =>
        (
          log.status || "present"
        ).toLowerCase() ===
        "present"
    ).length;

  const monthlyAbsentDays =
    monthlyAttendanceLogs.filter(
      (log) =>
        (
          log.status || ""
        ).toLowerCase() ===
        "absent"
    ).length;

  /* ======================================================
     YEARLY SUMMARY
  ====================================================== */

  const cardYearlyRecords =
    records.filter((record) => {

      const matchesStaff =
        selectedStaff === "All" ||
        record.staffName?.toLowerCase() ===
          selectedStaff.toLowerCase();

      const date = new Date(
        record.timestamp
      );

      return (
        matchesStaff &&
        date.getFullYear() ===
          yearlyYear
      );

    });

  const yearlyServicesCount =
    cardYearlyRecords.length;

  const yearlyDeptFee =
    cardYearlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.departmentFee || 0),
      0
    );

  const yearlyServiceCharge =
    cardYearlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.serviceCharge || 0),
      0
    );

  const yearlyGpayUpi =
    cardYearlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.gpayUpiAmount || 0),
      0
    );

  const yearlyCash =
    cardYearlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.totalAmount || 0),
      0
    );

  const yearlyCommission =
    cardYearlyRecords.reduce(
      (acc, curr) =>
        acc +
        Number(curr.commission || 0),
      0
    );

  return (

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ===============================
          DAILY PERFORMANCE
      ================================ */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 relative overflow-hidden">

        <div className="flex justify-between items-center border-b pb-3">

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Daily Performance
          </h3>

          <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
            <Calendar size={16} />
          </div>

        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2">

          <button
            onClick={() => {
              const prev = new Date(dailyDate);
              prev.setDate(prev.getDate() - 1);
              setDailyDate(prev);
            }}
            className="rounded-lg p-1.5 text-slate-600 shadow-sm transition hover:bg-white"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs font-bold text-slate-800">
            {dailyDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>

          <button
            onClick={() => {
              const next = new Date(dailyDate);
              next.setDate(next.getDate() + 1);
              setDailyDate(next);
            }}
            className="rounded-lg p-1.5 text-slate-600 shadow-sm transition hover:bg-white"
          >
            <ChevronRight size={16} />
          </button>

        </div>

        <div className="py-2 text-center">

          <h2 className="text-3xl font-black text-slate-900">
            {dailyServicesCount}
          </h2>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Services
          </p>

        </div>

        <div className="space-y-2.5 border-t pt-4 text-xs">

          <div className="flex justify-between font-medium text-slate-600">
            <span>Dept. Fee</span>
            <span className="font-bold text-slate-900">
              ₹{dailyDeptFee.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>Service Charge</span>
            <span className="font-bold text-slate-900">
              ₹{dailyServiceCharge.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>GPay / UPI</span>
            <span className="font-bold text-slate-900">
              ₹{dailyGpayUpi.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>Opening Balance</span>
            <span className="font-bold text-slate-900">
              ₹{dailyOpeningBal.toFixed(2)}
            </span>
          </div>
                    <div className="flex justify-between border-t pt-2 font-medium text-slate-600">

            <span className="font-black text-slate-800">
              Total Cash
            </span>

            <span className="text-sm font-black text-slate-900">
              ₹{dailyTotalCash.toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between font-medium text-slate-600">

            <span>
              Commission
            </span>

            <span className="font-bold text-emerald-600">
              ₹{dailyCommission.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

      {/* ===============================
          MONTHLY PERFORMANCE
      ================================ */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 relative overflow-hidden">

        <div className="flex justify-between items-center border-b pb-3">

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Monthly Performance
          </h3>

          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
            <Calendar size={16} />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2">

          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(Number(e.target.value))
            }
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            {monthNames.map((month, index) => (
              <option
                key={index}
                value={index}
              >
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(Number(e.target.value))
            }
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            {[2024, 2025, 2026, 2027].map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>

        </div>

        <div className="py-2 text-center">

          <h2 className="text-3xl font-black text-slate-900">
            {monthlyServicesCount}
          </h2>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Services
          </p>

        </div>

        <div className="space-y-2.5 border-t pt-4 text-xs">
          <div className="flex justify-between font-medium text-slate-600">
            <span>Dept. Fee</span>
            <span className="font-bold text-slate-900">
              ₹{monthlyDeptFee.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>Service Charge</span>
            <span className="font-bold text-slate-900">
              ₹{monthlyServiceCharge.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>Present Days</span>
            <span className="font-bold text-emerald-600">
              {monthlyPresentDays}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>Absent Days</span>
            <span className="font-bold text-red-600">
              {monthlyAbsentDays}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>Cash</span>
            <span className="font-bold text-slate-900">
              ₹{monthlyCash.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-t pt-2 font-medium text-slate-600">

            <span className="font-black text-slate-800">
              Commission
            </span>

            <span className="text-sm font-black text-emerald-600">
              ₹{monthlyCommission.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

      {/* ===============================
          YEARLY PERFORMANCE
      ================================ */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 relative overflow-hidden">

        <div className="flex justify-between items-center border-b pb-3">

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Yearly Performance
          </h3>

          <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
            <Calendar size={16} />
          </div>

        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2">

          <select
            value={yearlyYear}
            onChange={(e) =>
              setYearlyYear(Number(e.target.value))
            }
            className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-center text-xs font-bold outline-none cursor-pointer"
          >
            {[2024, 2025, 2026, 2027].map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>

        </div>

        <div className="py-2 text-center">

          <h2 className="text-3xl font-black text-slate-900">
            {yearlyServicesCount}
          </h2>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Services
          </p>

        </div>

        <div className="space-y-2.5 border-t pt-4 text-xs">

          <div className="flex justify-between font-medium text-slate-600">
            <span>Dept. Fee</span>
            <span className="font-bold text-slate-900">
              ₹{yearlyDeptFee.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>Service Charge</span>
            <span className="font-bold text-slate-900">
              ₹{yearlyServiceCharge.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>GPay / UPI</span>
            <span className="font-bold text-slate-900">
              ₹{yearlyGpayUpi.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium text-slate-600">
            <span>Cash</span>
            <span className="font-bold text-slate-900">
              ₹{yearlyCash.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-t pt-2 font-medium text-slate-600">

            <span className="font-black text-slate-800">
              Commission
            </span>

            <span className="text-sm font-black text-emerald-600">
              ₹{yearlyCommission.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

    </div>

  );

}