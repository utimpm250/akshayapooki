// components/MonthlyCard.tsx

"use client";

import React, { useState } from "react";
import { Calendar, X, QrCode } from "lucide-react";

import { MonthlyCardProps } from "./types";
import { formatCurrency } from "./SummaryHelpers";

const glass =
  "relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,.35)]";

const StatRow = ({
  label,
  value,
  color,
  clickable = false,
  onClick,
}: {
  label: string;
  value: number;
  color: string;
  clickable?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!clickable}
    className={`flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left backdrop-blur-xl transition ${
      clickable
        ? "cursor-pointer hover:bg-white/20 active:scale-[0.99]"
        : "cursor-default"
    }`}
    aria-label={clickable ? `${label} payment QR` : undefined}
  >
    <span className="text-sm font-medium text-white/80">{label}</span>

    <span className={`text-lg font-black ${color}`}>
      {formatCurrency(value)}
    </span>
  </button>
);

type MonthlyCardWithUpiProps = MonthlyCardProps & {
  upiId?: string;
};

export default function MonthlyCard({
  monthly,
  monthNames,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  basicSalary,
  monthlyBonus,
  finalMonthlySalary,
  upiId = "",
}: MonthlyCardWithUpiProps) {
  const [showSalaryQr, setShowSalaryQr] = useState(false);

  const cleanUpiId = String(upiId || "").trim();

  const upiPaymentUrl = cleanUpiId
    ? `upi://pay?pa=${encodeURIComponent(
        cleanUpiId
      )}&pn=${encodeURIComponent(
        "Staff Salary"
      )}&am=${encodeURIComponent(
        finalMonthlySalary.toFixed(2)
      )}&cu=INR&tn=${encodeURIComponent(
        `Salary - ${monthNames[selectedMonth]} ${selectedYear}`
      )}`
    : "";

  const qrImageUrl = upiPaymentUrl
    ? `https://quickchart.io/qr?size=300&margin=2&text=${encodeURIComponent(
        upiPaymentUrl
      )}`
    : "";

  return (
    <>
      <div
        className={`${glass} bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 p-6`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-100">
              Monthly
            </p>

            <h2 className="text-2xl font-black text-white">Performance</h2>
          </div>

          <div className="rounded-2xl bg-white/20 p-3">
            <Calendar size={22} className="text-white" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-2xl border border-white/20 bg-white/10 p-3 text-sm font-semibold text-white backdrop-blur-xl outline-none"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index} className="text-black">
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-2xl border border-white/20 bg-white/10 p-3 text-sm font-semibold text-white backdrop-blur-xl outline-none"
          >
            {Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - 5 + i
            ).map((year) => (
              <option key={year} value={year} className="text-black">
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-4xl font-black text-white">
            {monthly.services}
          </h1>

          <p className="text-xs uppercase tracking-widest text-white/70">
            Total Services
          </p>
        </div>

        <div className="space-y-3">
          <StatRow
            label="Dept Fee"
            value={monthly.deptFee}
            color="text-cyan-300"
          />

          <StatRow
            label="Service Charge"
            value={monthly.serviceCharge}
            color="text-fuchsia-300"
          />

          <StatRow
            label="Monthly Credit"
            value={monthly.credit}
            color="text-emerald-300"
          />

          <StatRow
            label="Total Cash"
            value={monthly.totalCash}
            color="text-yellow-300"
          />

          <StatRow
            label="Basic Salary"
            value={basicSalary}
            color="text-sky-300"
          />

          <StatRow
            label="Bonus (5%)"
            value={monthlyBonus}
            color="text-lime-300"
          />

          <StatRow
            label="Final Salary"
            value={finalMonthlySalary}
            color="text-orange-300"
            clickable
            onClick={() => setShowSalaryQr(true)}
          />
        </div>
      </div>

      {showSalaryQr && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowSalaryQr(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Final salary payment QR"
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <QrCode size={20} className="text-purple-600" />
                  <h3 className="text-xl font-black text-slate-900">
                    Salary Payment
                  </h3>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {monthNames[selectedMonth]} {selectedYear}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSalaryQr(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close salary QR"
              >
                <X size={20} />
              </button>
            </div>

            {cleanUpiId ? (
              <>
                <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Final Salary
                  </p>

                  <p className="mt-1 text-3xl font-black text-purple-700">
                    {formatCurrency(finalMonthlySalary)}
                  </p>

                  <p className="mt-2 break-all text-xs text-slate-500">
                    UPI: {cleanUpiId}
                  </p>
                </div>

                <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
                  <img
                    src={qrImageUrl}
                    alt="UPI QR code for final salary payment"
                    width={260}
                    height={260}
                    className="h-[260px] w-[260px] object-contain"
                  />
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Scan this QR code with Google Pay, PhonePe, Paytm or another
                  UPI app to pay the exact final salary amount.
                </p>
              </>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                <p className="font-bold text-amber-800">
                  UPI ID is not set for this staff member.
                </p>
                <p className="mt-2 text-sm text-amber-700">
                  Add the staff member&apos;s UPI ID in Staff Management and
                  save the changes.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
