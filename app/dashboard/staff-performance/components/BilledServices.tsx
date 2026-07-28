"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

import { PerformanceRecord } from "../types";

interface BilledServicesProps {
  records: PerformanceRecord[];
  selectedStaff: string;
  searchQuery: string;
}

export default function BilledServices({
  records,
  selectedStaff,
  searchQuery,
}: BilledServicesProps) {

  const staffFilteredRecords = records.filter(
    (record) => {

      const matchesStaff =
        selectedStaff === "All" ||
        record.staffName?.toLowerCase() ===
          selectedStaff.toLowerCase();

      const matchesSearch =
        record.customerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        record.staffName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesStaff && matchesSearch;
    }
  );

  const totalServiceCharge =
    staffFilteredRecords.reduce(
      (acc, curr) =>
        acc + Number(curr.serviceCharge || 0),
      0
    );

  const totalDepartmentFee =
    staffFilteredRecords.reduce(
      (acc, curr) =>
        acc + Number(curr.departmentFee || 0),
      0
    );

  const totalFilteredCollection =
    staffFilteredRecords.reduce(
      (acc, curr) =>
        acc + Number(curr.totalAmount || 0),
      0
    );

  if (staffFilteredRecords.length === 0) {

    return (

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="text-center py-12 text-slate-400">

          <ShieldAlert
            size={40}
            className="mx-auto mb-2 opacity-40"
          />

          <p className="text-sm font-semibold">
            No billed service records found.
          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm">

          <thead>

            <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 uppercase text-[11px] tracking-wider">

              <th className="py-3 px-4">
                Date / Time
              </th>

              <th className="py-3 px-4">
                Staff Name
              </th>

              <th className="py-3 px-4">
                Customer Name
              </th>

              <th className="py-3 px-4 text-right">
                Service Chg.
              </th>

              <th className="py-3 px-4 text-right">
                Dept Fee
              </th>

              <th className="py-3 px-4 text-right">
                Total Amount
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">
                        {staffFilteredRecords.map((rec) => (

              <tr
                key={rec.id}
                className="hover:bg-slate-50/80 transition text-slate-700"
              >

                <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                  {new Date(
                    rec.timestamp
                  ).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="py-3.5 px-4 font-bold text-indigo-600">

                  <span className="bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">
                    {rec.staffName || "Admin User"}
                  </span>

                </td>

                <td className="py-3.5 px-4 font-medium">
                  {rec.customerName || "Walk-in Customer"}
                </td>

                <td className="py-3.5 px-4 text-right font-semibold text-emerald-600">
                  ₹
                  {Number(
                    rec.serviceCharge || 0
                  ).toFixed(2)}
                </td>

                <td className="py-3.5 px-4 text-right font-semibold text-amber-600">
                  ₹
                  {Number(
                    rec.departmentFee || 0
                  ).toFixed(2)}
                </td>

                <td className="py-3.5 px-4 text-right font-black text-slate-900">
                  ₹
                  {Number(
                    rec.totalAmount || 0
                  ).toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

          <tfoot>

            <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-200">

              <td
                colSpan={3}
                className="py-3.5 px-4 text-right uppercase text-xs"
              >
                Total Sum:
              </td>
                            <td className="py-3.5 px-4 text-right text-emerald-700">
                ₹{totalServiceCharge.toFixed(2)}
              </td>

              <td className="py-3.5 px-4 text-right text-amber-700">
                ₹{totalDepartmentFee.toFixed(2)}
              </td>

              <td className="py-3.5 px-4 text-right text-slate-900 text-base">
                ₹{totalFilteredCollection.toFixed(2)}
              </td>

            </tr>

          </tfoot>

        </table>

      </div>

    </div>

  );

}