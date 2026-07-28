"use client";

import React from "react";
import {
  X,
  Wallet,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";

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

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-emerald-100 p-3">

              <Wallet
                size={24}
                className="text-emerald-700"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Salary Payment History
              </h2>

              <p className="text-sm text-slate-500">
                Complete salary payment records
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="max-h-[70vh] overflow-auto">

          {salaryHistory.length === 0 ? (

            <div className="flex flex-col items-center justify-center p-16">

              <Wallet
                size={50}
                className="text-slate-300"
              />

              <h3 className="mt-5 text-xl font-bold text-slate-700">
                No Salary History
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No salary payments have been recorded yet.
              </p>

            </div>

          ) : (

            <table className="min-w-full">

              <thead className="sticky top-0 bg-slate-50">

                <tr className="border-b border-slate-200">
                                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                    <div className="flex items-center gap-2">

                      <Calendar size={14} />

                      Date

                    </div>

                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                    <div className="flex items-center gap-2">

                      <User size={14} />

                      Staff

                    </div>

                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">

                    <div className="flex items-center justify-end gap-2">

                      <Wallet size={14} />

                      Amount

                    </div>

                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                    <div className="flex items-center gap-2">

                      <CreditCard size={14} />

                      Payment Method

                    </div>

                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">

                    Notes

                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {salaryHistory.map((salary) => (

                  <tr
                    key={salary.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-700">

                      {new Date(
                        salary.paymentDate
                      ).toLocaleDateString("en-GB")}

                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">

                      {salary.staffName}

                    </td>

                    <td className="px-5 py-4 text-right">

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">

                        ₹{Number(
                          salary.amount || 0
                        ).toFixed(2)}

                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">

                        {salary.paymentMethod}

                      </span>

                    </td>

                    <td className="px-5 py-4 text-slate-600">

                      {salary.notes || "-"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

          <div className="text-sm text-slate-500">

            Total Records :
            <span className="ml-2 font-bold text-slate-800">
              {salaryHistory.length}
            </span>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );

}