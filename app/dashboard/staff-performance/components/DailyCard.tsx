// components/DailyCard.tsx

"use client";

import React from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { DailyCardProps } from "./types";
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

export default function DailyCard({
  daily,
  dailyDate,
  setDailyDate,
}: DailyCardProps) {
  return (
    <div
      className={`${glass} bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-700 p-6`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">
            Daily
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

      <div className="mb-6 flex items-center justify-between rounded-2xl bg-white/10 p-3">
        <button
          onClick={() => {
            const d = new Date(dailyDate);
            d.setDate(d.getDate() - 1);
            setDailyDate(d);
          }}
          className="rounded-xl bg-white/20 p-2 transition hover:bg-white/30"
        >
          <ChevronLeft className="text-white" />
        </button>

        <div className="text-center">
          <p className="text-xs text-white/70">
            {dailyDate.toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </p>

          <h1 className="text-4xl font-black text-white">
            {daily.services}
          </h1>

          <p className="text-xs uppercase tracking-widest text-white/70">
            Services
          </p>
        </div>

        <button
          onClick={() => {
            const d = new Date(dailyDate);
            d.setDate(d.getDate() + 1);
            setDailyDate(d);
          }}
          className="rounded-xl bg-white/20 p-2 transition hover:bg-white/30"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>

      <div className="space-y-3">
        <StatRow
          label="Dept Fee"
          value={daily.deptFee}
          color="text-cyan-300"
        />

        <StatRow
          label="Service Charge"
          value={daily.serviceCharge}
          color="text-fuchsia-300"
        />

        <StatRow
          label="Daily Credit"
          value={daily.credit}
          color="text-emerald-300"
        />

        <StatRow
          label="Total Cash"
          value={daily.totalCash}
          color="text-yellow-300"
        />
      </div>
    </div>
  );
}