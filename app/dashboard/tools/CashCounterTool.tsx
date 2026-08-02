"use client";

import { Banknote, RotateCcw, X } from "lucide-react";
import { useCashCounter } from "../hooks/useCashCounter";

interface CashCounterToolProps {
  onClose: () => void;
}

export default function CashCounterTool({
  onClose,
}: CashCounterToolProps) {
  const cash = useCashCounter();

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">

      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col my-8 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">

          <div className="flex items-center gap-2.5">

            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Banknote size={20} />
            </div>

            <h3 className="font-bold text-slate-800 text-lg">
              Cash Counter
            </h3>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={cash.handleCashReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 rounded-lg"
            >
              <RotateCcw size={14}/>
              Reset
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg"
            >
              <X size={18}/>
            </button>

          </div>

        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT */}

          <div className="md:col-span-7 grid grid-cols-3 gap-3">

            {cash.denominations.map((denom) => {

              const qty =
                parseInt(
                  cash.cashCounts[
                    denom as keyof typeof cash.cashCounts
                  ],
                  10
                ) || 0;

              const subtotal = qty * denom;

              return (

                <div
                  key={denom}
                  className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center justify-between space-y-2 shadow-sm"
                >

                  <span className="font-extrabold text-slate-800 text-sm">
                    ₹{denom}
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={
                      cash.cashCounts[
                        denom as keyof typeof cash.cashCounts
                      ]
                    }
                    onChange={(e) =>
                      cash.handleCashInputChange(
                        denom as keyof typeof cash.cashCounts,
                        e.target.value
                      )
                    }
                    className="w-full h-10 text-center rounded-xl border border-slate-200 bg-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <span className="text-[11px] font-semibold text-slate-400">
                    = ₹{subtotal}
                  </span>

                </div>

              );
            })}

          </div>

          {/* RIGHT */}

          <div className="md:col-span-5 space-y-4">

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Summary Details
              </h4>

              <div className="mt-4 flex justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">

                <span className="text-sm text-slate-600">
                  Total Notes
                </span>

                <span className="font-bold">
                  {cash.totalNotes}
                </span>

              </div>

              <div className="mt-3 flex justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">

                <span className="text-sm text-slate-600">
                  Total Amount
                </span>

                <span className="font-bold text-emerald-600">
                  ₹{cash.grandTotal}
                </span>

              </div>

            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-center text-white">

              <p className="text-xs font-bold uppercase tracking-wider opacity-90">
                Grand Total
              </p>

              <h2 className="mt-1 text-3xl font-black">
                ₹{cash.grandTotal}
              </h2>

            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 font-bold hover:bg-slate-50"
            >
              Done / Close
            </button>

          </div>
                  </div>

      </div>

    </div>
  );
}