"use client";

import React from "react";
import { X } from "lucide-react";

import { SalaryHistory } from "../types";

interface SalaryHistoryModalProps {
  isOpen: boolean;
  salaryHistory: SalaryHistory[];
  onClose: () => void;
}

export default function SalaryHistoryModal({
  isOpen,
  salaryHistory,
  onClose,
}: SalaryHistoryModalProps) {

  if (!isOpen) {
    return null;
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Salary Payment History
            </h2>

            <p className="text-sm text-slate-500">
              All recorded salary payments
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        <div className="max-h-[70vh] overflow-auto">

          <table className="w-full text-left text-sm">

            <thead className="sticky top-0 bg-slate-50">

              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">

                <th className="px-4 py-3">
                  Date
                </th>

                <th className="px-4 py-3">
                  Staff
                </th>

                <th className="px-4 py-3 text-right">
                  Amount
                </th>

                <th className="px-4 py-3">
                  Method
                </th>

                <th className="px-4 py-3">
                  Notes
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">
              {salaryHistory.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No salary payment history found.
                  </td>

                </tr>

              ) : (

                salaryHistory.map((salary) => (

                  <tr
                    key={salary.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-4 py-3">
                      {new Date(
                        salary.paymentDate
                      ).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {salary.staffName}
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-emerald-600">
                      ₹{Number(salary.amount || 0).toFixed(2)}
                    </td>

                    <td className="px-4 py-3">
                      {salary.paymentMethod}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {salary.notes || "-"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );

}