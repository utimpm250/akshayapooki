"use client";

import React from "react";
import { X } from "lucide-react";

import {
  PerformanceRecord,
  Holiday,
} from "../types";

interface AttendanceModalProps {
  selectedDate: Date | null;
  selectedRecord: PerformanceRecord | null;
  selectedHoliday: Holiday | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AttendanceModal({
  selectedDate,
  selectedRecord,
  selectedHoliday,
  isOpen,
  onClose,
}: AttendanceModalProps) {

  if (!isOpen || !selectedDate) {
    return null;
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-800">
              Attendance Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {selectedDate.toLocaleDateString(
                "en-GB",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-6 p-6">

          {selectedHoliday ? (

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

              <div className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                Holiday
              </div>

              <h3 className="text-lg font-bold text-amber-800">
                {selectedHoliday.name}
              </h3>

            </div>

          ) : selectedRecord ? (

            <>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Login Time
                  </p>

                  <p className="mt-2 text-2xl font-bold text-emerald-700">
                    {selectedRecord.loginTime || "--"}
                  </p>

                </div>
                                <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Logout Time
                  </p>

                  <p className="mt-2 text-2xl font-bold text-rose-700">
                    {selectedRecord.logoutTime || "--"}
                  </p>

                </div>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <h3 className="mb-5 text-base font-bold text-slate-800">
                  Performance Summary
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <div className="rounded-xl bg-white p-4 shadow-sm">

                    <p className="text-xs text-slate-500">
                      Total Services
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-800">
                      {selectedRecord.totalServices}
                    </p>

                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">

                    <p className="text-xs text-slate-500">
                      Department Fee
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-800">
                      ₹{Number(
                        selectedRecord.departmentFee || 0
                      ).toFixed(2)}
                    </p>

                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">

                    <p className="text-xs text-slate-500">
                      Service Charge
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-800">
                      ₹{Number(
                        selectedRecord.serviceCharge || 0
                      ).toFixed(2)}
                    </p>

                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">

                    <p className="text-xs text-slate-500">
                      Cash Collection
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-700">
                      ₹{Number(
                        selectedRecord.cashAmount || 0
                      ).toFixed(2)}
                    </p>

                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">

                    <p className="text-xs text-slate-500">
                      GPay / UPI
                    </p>

                    <p className="mt-1 text-xl font-bold text-indigo-700">
                      ₹{Number(
                        selectedRecord.gpayUpiAmount || 0
                      ).toFixed(2)}
                    </p>

                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">

                    <p className="text-xs text-slate-500">
                      Commission
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-600">
                      ₹{Number(
                        selectedRecord.commission || 0
                      ).toFixed(2)}
                    </p>

                  </div>

                </div>

              </div>

            </>
                      ) : (

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">

                <span className="text-2xl">📅</span>

              </div>

              <h3 className="text-lg font-bold text-slate-700">
                No Attendance Record
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No login or logout record was found for this date.
              </p>

              <div className="mt-6 inline-flex rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                Status : Absent
              </div>

            </div>

          )}

        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );

}