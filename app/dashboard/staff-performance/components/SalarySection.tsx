"use client";

import React from "react";
import {
  Wallet,
  History,
} from "lucide-react";

import {
  PerformanceRecord,
  SalaryHistory,
} from "../types";

interface SalarySectionProps {
  records: PerformanceRecord[];
  salaryHistory: SalaryHistory[];
  selectedStaff: string;
  selectedMonth: number;
  selectedYear: number;
  onOpenHistory: () => void;
}

export default function SalarySection({
  records,
  salaryHistory,
  selectedStaff,
  selectedMonth,
  selectedYear,
  onOpenHistory,
}: SalarySectionProps) {

  const monthlyRecords = records.filter((record) => {

    const date = new Date(record.date);

    const matchesStaff =
      selectedStaff === "All" ||
      record.staffName?.toLowerCase() ===
        selectedStaff.toLowerCase();

    return (
      matchesStaff &&
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    );

  });

  const totalCommission = monthlyRecords.reduce(
    (sum, record) =>
      sum + Number(record.commission || 0),
    0
  );

  const totalDepartmentFee = monthlyRecords.reduce(
    (sum, record) =>
      sum + Number(record.departmentFee || 0),
    0
  );

  const totalServiceCharge = monthlyRecords.reduce(
    (sum, record) =>
      sum + Number(record.serviceCharge || 0),
    0
  );

  const totalServices = monthlyRecords.reduce(
    (sum, record) =>
      sum + Number(record.totalServices || 0),
    0
  );

  const latestSalary =
    salaryHistory.length > 0
      ? salaryHistory[0]
      : null;

  return (

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

        <div className="flex items-center gap-3">

          <Wallet
            size={22}
            className="text-emerald-600"
          />

          <div>

            <h2 className="text-lg font-bold text-slate-800">
              Salary Summary
            </h2>

            <p className="text-sm text-slate-500">
              Monthly salary overview
            </p>

          </div>

        </div>

        <button
          onClick={onOpenHistory}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition"
        >
          <History size={16} />
          Salary History
        </button>

      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Services
            </p>

            <h3 className="mt-2 text-3xl font-black text-slate-800">
              {totalServices}
            </h3>

          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

            <p className="text-xs uppercase tracking-wide text-emerald-700">
              Service Charge
            </p>

            <h3 className="mt-2 text-3xl font-black text-emerald-700">
              ₹{totalServiceCharge.toFixed(2)}
            </h3>

          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

            <p className="text-xs uppercase tracking-wide text-amber-700">
              Department Fee
            </p>

            <h3 className="mt-2 text-3xl font-black text-amber-700">
              ₹{totalDepartmentFee.toFixed(2)}
            </h3>

          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">

            <p className="text-xs uppercase tracking-wide text-indigo-700">
              Total Commission
            </p>

            <h3 className="mt-2 text-3xl font-black text-indigo-700">
              ₹{totalCommission.toFixed(2)}
            </h3>

          </div>

        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <h3 className="text-base font-bold text-slate-800">
            Latest Salary Payment
          </h3>

          {latestSalary ? (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Staff Name
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {latestSalary.staffName}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Paid Amount
                </p>

                <p className="mt-1 text-lg font-black text-emerald-600">
                  ₹{Number(latestSalary.amount || 0).toFixed(2)}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Payment Date
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {new Date(
                    latestSalary.paymentDate
                  ).toLocaleDateString("en-GB")}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Payment Method
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {latestSalary.paymentMethod}
                </p>

              </div>

              {latestSalary.notes && (

                <div className="md:col-span-2">

                  <p className="text-xs uppercase text-slate-500">
                    Notes
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {latestSalary.notes}
                  </p>

                </div>

              )}

            </div>

          ) : (

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">

              <p className="font-semibold text-slate-500">
                No salary payment history found.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}