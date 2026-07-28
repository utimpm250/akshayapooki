"use client";

import React from "react";
import { Users } from "lucide-react";

import { PerformanceRecord } from "../types";

interface StaffTableProps {
  records: PerformanceRecord[];
  selectedStaff: string;
  searchQuery: string;
}

export default function StaffTable({
  records,
  selectedStaff,
  searchQuery,
}: StaffTableProps) {

  const filteredRecords = records.filter((record) => {

    const matchesStaff =
      selectedStaff === "All" ||
      record.staffName?.toLowerCase() ===
        selectedStaff.toLowerCase();

    const matchesSearch =
      record.staffName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      record.customerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesStaff && matchesSearch;

  });

  if (filteredRecords.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="py-12 text-center text-slate-400">

          <Users
            size={42}
            className="mx-auto mb-3 opacity-40"
          />

          <p className="font-semibold">
            No staff performance found.
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wider">

              <th className="px-4 py-3 text-left">
                Staff
              </th>

              <th className="px-4 py-3 text-left">
                Services
              </th>

              <th className="px-4 py-3 text-right">
                Dept Fee
              </th>

              <th className="px-4 py-3 text-right">
                Service Charge
              </th>

              <th className="px-4 py-3 text-right">
                Commission
              </th>

              <th className="px-4 py-3 text-right">
                Cash
              </th>

              <th className="px-4 py-3 text-right">
                GPay / UPI
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((record) => (

              <tr
                key={record.id}
                className="hover:bg-slate-50 transition"
              >

                <td className="px-4 py-3">

                  <div className="font-semibold text-slate-800">
                    {record.staffName}
                  </div>

                  <div className="text-xs text-slate-500">
                    {record.customerName}
                  </div>

                </td>

                <td className="px-4 py-3 font-semibold">
                  {record.totalServices}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  ₹{Number(record.departmentFee || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right font-medium text-emerald-600">
                  ₹{Number(record.serviceCharge || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right font-bold text-indigo-600">
                  ₹{Number(record.commission || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right">
                  ₹{Number(record.cashAmount || 0).toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right">
                  ₹{Number(record.gpayUpiAmount || 0).toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

          <tfoot>

            <tr className="border-t-2 border-slate-200 bg-slate-100 font-bold">

              <td className="px-4 py-3">
                Total
              </td>

              <td className="px-4 py-3">
                {filteredRecords.reduce(
                  (sum, r) => sum + Number(r.totalServices || 0),
                  0
                )}
              </td>

              <td className="px-4 py-3 text-right">
                ₹
                {filteredRecords
                  .reduce(
                    (sum, r) =>
                      sum + Number(r.departmentFee || 0),
                    0
                  )
                  .toFixed(2)}
              </td>

              <td className="px-4 py-3 text-right">
                ₹
                {filteredRecords
                  .reduce(
                    (sum, r) =>
                      sum + Number(r.serviceCharge || 0),
                    0
                  )
                  .toFixed(2)}
              </td>

              <td className="px-4 py-3 text-right">
                ₹
                {filteredRecords
                  .reduce(
                    (sum, r) =>
                      sum + Number(r.commission || 0),
                    0
                  )
                  .toFixed(2)}
              </td>

              <td className="px-4 py-3 text-right">
                ₹
                {filteredRecords
                  .reduce(
                    (sum, r) =>
                      sum + Number(r.cashAmount || 0),
                    0
                  )
                  .toFixed(2)}
              </td>

              <td className="px-4 py-3 text-right">
                ₹
                {filteredRecords
                  .reduce(
                    (sum, r) =>
                      sum + Number(r.gpayUpiAmount || 0),
                    0
                  )
                  .toFixed(2)}
              </td>

            </tr>

          </tfoot>

        </table>

      </div>

    </div>

  );

}