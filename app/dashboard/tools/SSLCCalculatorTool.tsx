"use client";

import {
  Award,
  Calculator,
  CheckCircle2,
  RotateCcw,
  X,
} from "lucide-react";

import { useSSLCCalculator } from "../hooks/useSSLCCalculator";

interface SSLCCalculatorToolProps {
  onClose: () => void;
}

export default function SSLCCalculatorTool({
  onClose,
}: SSLCCalculatorToolProps) {
  const sslc = useSSLCCalculator();

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">

      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col my-8 max-h-[92vh] overflow-y-auto">

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Calculator size={20} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Kerala SSLC Grade Calculator
              </h3>

              <p className="text-xs text-slate-500">
                Calculate percentage & overall grade
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={sslc.handleSslcReset}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50"
            >
              <RotateCcw size={14} />
              Reset
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-50"
            >
              <X size={18} />
            </button>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12">
                      {/* LEFT SIDE */}

          <section className="lg:col-span-7">

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">

              <h4 className="mb-5 text-lg font-bold text-slate-800">
                Enter Grade Count
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                {sslc.gradeCards.map((grade) => (

                  <div
                    key={grade.key}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <h5 className={`text-lg font-black ${grade.color}`}>
                          {grade.label}
                        </h5>

                        <p className="text-xs text-slate-500">
                          {grade.points}
                        </p>

                      </div>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={sslc.grades[grade.key]}
                        onChange={(e) =>
                          sslc.handleSslcInputChange(
                            grade.key,
                            e.target.value
                          )
                        }
                        placeholder="0"
                        className="h-11 w-20 rounded-xl border border-slate-200 text-center font-bold focus:border-blue-500 focus:outline-none"
                      />

                    </div>

                  </div>

                ))}

              </div>

              <button
                onClick={sslc.calculateSslcResults}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700"
              >
                <Calculator size={18} />
                Calculate Result
              </button>

            </div>

          </section>
                    {/* RIGHT SIDE */}

          <section className="space-y-4 lg:col-span-5">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <Award className="text-amber-500" size={20} />

                <h4 className="text-lg font-bold text-slate-800">
                  Result Summary
                </h4>

              </div>

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                  <span className="text-sm text-slate-600">
                    Total Subjects
                  </span>

                  <span className="font-bold">
                    {sslc.totalSubjectsSelected} / 10
                  </span>

                </div>

                {sslc.sslcResultObj ? (

                  <>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                      <span className="text-sm text-slate-600">
                        Total Grade Points
                      </span>

                      <span className="font-bold">
                        {sslc.sslcResultObj.totalPoints}
                      </span>

                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                      <span className="text-sm text-slate-600">
                        Percentage
                      </span>

                      <span className="font-bold text-blue-600">
                        {sslc.sslcResultObj.percentage}%
                      </span>

                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-center text-white">

                      <CheckCircle2
                        size={36}
                        className="mx-auto mb-3"
                      />

                      <p className="text-sm opacity-90">
                        Overall Grade
                      </p>

                      <h2 className="mt-2 text-4xl font-black">
                        {sslc.sslcResultObj.overallGrade}
                      </h2>

                    </div>

                  </>

                ) : (

                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">

                    <Calculator
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Enter grade counts and click
                      <strong> Calculate Result</strong>.
                    </p>

                  </div>

                )}

              </div>

            </div>
                      </section>

        </div>

      </div>

    </div>
  );
}