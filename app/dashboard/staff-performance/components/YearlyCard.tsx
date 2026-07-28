// components/YearlyCard.tsx

"use client";

import React from "react";
import { Calendar } from "lucide-react";

import { YearlyCardProps } from "./types";
import { formatCurrency } from "./SummaryHelpers";

const glass =
  "relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,.35)]";

const StatRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
    <span className="text-sm font-medium text-white/80">
      {label}
    </span>

    <span className={`text-lg font-black ${color}`}>
      {formatCurrency(value)}
    </span>
  </div>
);

export default function YearlyCard({
  yearly,
  yearlyYear,
  setYearlyYear,
  yearlySalary,
  yearlyBonus,
  finalYearlySalary,
}: YearlyCardProps) {
  return (
    <div
      className={`${glass} bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-6`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-100">
            Yearly
          </p>

          <h2 className="text-2xl font-black text-white">
            Performance
          </h2>
        </div>

        <div className="rounded-2xl bg-white/20 p-3">
          <Calendar
            size={22}
            className="text-white"
          />
        </div>
      </div>

      <div className="mb-6">
        <select
          value={yearlyYear}
          onChange={(e) =>
            setYearlyYear(Number(e.target.value))
          }
          className="w-full rounded-2xl border border-white/20 bg-white/10 p-3 text-center text-sm font-semibold text-white backdrop-blur-xl outline-none"
        >
          {Array.from(
            { length: 10 },
            (_, i) =>
              new Date().getFullYear() - 5 + i
          ).map((year) => (
            <option
              key={year}
              value={year}
              className="text-black"
            >
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-4xl font-black text-white">
          {yearly.services}
        </h1>

        <p className="text-xs uppercase tracking-widest text-white/70">
          Total Services
        </p>
      </div>

      <div className="space-y-3">
        <StatRow
          label="Dept Fee"
          value={yearly.deptFee}
          color="text-cyan-300"
        />

        <StatRow
          label="Service Charge"
          value={yearly.serviceCharge}
          color="text-fuchsia-300"
        />

        <StatRow
          label="Yearly Credit"
          value={yearly.credit}
          color="text-emerald-300"
        />

        <StatRow
          label="Total Cash"
          value={yearly.totalCash}
          color="text-yellow-300"
        />

        <StatRow
          label="Year Salary"
          value={yearlySalary}
          color="text-sky-300"
        />

        <StatRow
          label="Total Bonus"
          value={yearlyBonus}
          color="text-lime-300"
        />

        <StatRow
          label="Final Salary"
          value={finalYearlySalary}
          color="text-orange-300"
        />
      </div>
    </div>
  );
}