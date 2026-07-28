"use client";

import React from "react";
import {
  Wallet,
  History,
  IndianRupee,
  BriefcaseBusiness,
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

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-emerald-100 p-3">

            <Wallet
              size={24}
              className="text-emerald-700"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Salary Summary
            </h2>

            <p className="text-sm text-slate-500">
              Monthly salary & commission overview
            </p>

          </div>

        </div>
                <button
          onClick={onOpenHistory}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
        >
          <History size={18} />
          Salary History
        </button>

      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Services
            </p>

            <BriefcaseBusiness
              size={18}
              className="text-slate-500"
            />

          </div>

          <h3 className="mt-4 text-3xl font-black text-slate-800">
            {totalServices}
          </h3>

        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Service Charge
            </p>

            <IndianRupee
              size={18}
              className="text-emerald-700"
            />

          </div>

          <h3 className="mt-4 text-3xl font-black text-emerald-700">
            ₹{totalServiceCharge.toFixed(2)}
          </h3>

        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Department Fee
            </p>

            <IndianRupee
              size={18}
              className="text-amber-700"
            />

          </div>

          <h3 className="mt-4 text-3xl font-black text-amber-700">
            ₹{totalDepartmentFee.toFixed(2)}
          </h3>

        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Total Commission
            </p>

            <IndianRupee
              size={18}
              className="text-indigo-700"
            />

          </div>

          <h3 className="mt-4 text-3xl font-black text-indigo-700">
            ₹{totalCommission.toFixed(2)}
          </h3>

        </div>

      </div>

      <div className="px-6 pb-6">

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

          <h3 className="text-lg font-bold text-slate-800">
            Latest Salary Payment
          </h3>

          {latestSalary ? (
                        <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Staff Name
                </p>

                <p className="mt-2 text-lg font-bold text-slate-800">
                  {latestSalary.staffName}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Paid Amount
                </p>

                <p className="mt-2 text-2xl font-black text-emerald-600">
                  ₹{Number(
                    latestSalary.amount || 0
                  ).toFixed(2)}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Date
                </p>

                <p className="mt-2 font-semibold text-slate-700">
                  {new Date(
                    latestSalary.paymentDate
                  ).toLocaleDateString("en-GB")}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Method
                </p>

                <p className="mt-2 font-semibold text-slate-700">
                  {latestSalary.paymentMethod}
                </p>

              </div>

              {latestSalary.notes && (

                <div className="md:col-span-2">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Notes
                  </p>

                  <div className="mt-2 rounded-xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                    {latestSalary.notes}
                  </div>

                </div>

              )}

            </div>

          ) : (

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">

                <Wallet
                  size={30}
                  className="text-slate-400"
                />

              </div>

              <h4 className="text-lg font-bold text-slate-700">
                No Salary History
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                No salary payment history is available for the selected period.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}