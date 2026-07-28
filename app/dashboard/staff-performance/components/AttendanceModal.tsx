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

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

          <div>

            <h2 className="text-lg font-bold text-slate-800">
              Attendance Details
            </h2>

            <p className="text-sm text-slate-500">
              {selectedDate.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-6 space-y-5">
          {selectedHoliday ? (

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

              <h3 className="text-base font-bold text-amber-800">
                Holiday
              </h3>

              <p className="mt-2 text-sm font-medium text-amber-700">
                {selectedHoliday.name}
              </p>

            </div>

          ) : selectedRecord ? (

            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs uppercase text-slate-500">
                    Login Time
                  </p>

                  <p className="mt-1 text-base font-bold text-emerald-600">
                    {selectedRecord.loginTime || "--"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs uppercase text-slate-500">
                    Logout Time
                  </p>

                  <p className="mt-1 text-base font-bold text-rose-600">
                    {selectedRecord.logoutTime || "--"}
                  </p>

                </div>

              </div>

              <div className="rounded-xl border border-slate-200 p-4">

                <h3 className="mb-3 text-sm font-bold text-slate-700">
                  Performance Summary
                </h3>

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <p className="text-xs text-slate-500">
                      Services
                    </p>

                    <p className="font-bold text-slate-800">
                      {selectedRecord.totalServices}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Department Fee
                    </p>

                    <p className="font-bold text-slate-800">
                      ₹{Number(selectedRecord.departmentFee || 0).toFixed(2)}
                    </p>
                  </div>
                                    <div>
                    <p className="text-xs text-slate-500">
                      Service Charge
                    </p>

                    <p className="font-bold text-slate-800">
                      ₹{Number(selectedRecord.serviceCharge || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Cash Collection
                    </p>

                    <p className="font-bold text-slate-800">
                      ₹{Number(selectedRecord.cashAmount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      GPay / UPI
                    </p>

                    <p className="font-bold text-slate-800">
                      ₹{Number(selectedRecord.gpayUpiAmount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Commission
                    </p>

                    <p className="font-bold text-emerald-600">
                      ₹{Number(selectedRecord.commission || 0).toFixed(2)}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          ) : (

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">

              <p className="text-base font-semibold text-slate-600">
                No attendance record found.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                The staff member was absent on this day.
              </p>

            </div>

          )}

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