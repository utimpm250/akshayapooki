"use client";

import React, { useState, useEffect } from "react";

interface ConverterProps {
  onClose: () => void;
}

export default function LandAreaConverterTool({ onClose }: ConverterProps) {
  const [converterValue, setConverterValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Square Meter");
  const [toUnit, setToUnit] = useState("Square Feet");
  const [convertedValue, setConvertedValue] = useState("");

  const convertLandArea = () => {
    const unitValues: Record<string, number> = {
      "Square Meter": 1,
      "Square Feet": 0.092903,
      Cent: 40.468564,
      Are: 100,
      Hectare: 10000,
      Acre: 4046.8564224,
    };

    const value = Number(converterValue);
    if (!value) {
      setConvertedValue("");
      return;
    }

    const sqm = value * unitValues[fromUnit];
    const result = sqm / unitValues[toUnit];
    setConvertedValue(result.toFixed(6));
  };

  useEffect(() => {
    convertLandArea();
  }, [converterValue, fromUnit, toUnit]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-md sm:p-5">
      <div className="w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/80 bg-white/95 shadow-[0_30px_100px_rgba(15,23,42,0.28)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-800">Land Area Converter</h3>
            <p className="text-[11px] font-medium text-slate-500">Convert between Square Meter, Square Feet, Cent, Are, Hectare and Acre.</p>
          </div>
          <button
            onClick={() => {
              onClose();
              setConverterValue("");
              setConvertedValue("");
              setFromUnit("Square Meter");
              setToUnit("Square Feet");
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Enter Value</label>
              <input
                type="number"
                value={converterValue}
                onChange={(e) => setConverterValue(e.target.value)}
                placeholder="Enter value"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_64px_1fr] md:gap-4">
              <div className="w-full">
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">From Unit</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option>Square Meter</option>
                  <option>Square Feet</option>
                  <option>Cent</option>
                  <option>Are</option>
                  <option>Hectare</option>
                  <option>Acre</option>
                </select>
              </div>

              <div className="flex items-end justify-center pb-1">
                <button
                  type="button"
                  onClick={() => {
                    const oldFrom = fromUnit;
                    setFromUnit(toUnit);
                    setToUnit(oldFrom);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  ⇄
                </button>
              </div>

              <div className="w-full">
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">To Unit</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800"
                >
                  <option>Square Feet</option>
                  <option>Square Meter</option>
                  <option>Cent</option>
                  <option>Are</option>
                  <option>Hectare</option>
                  <option>Acre</option>
                </select>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 text-center shadow-sm sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Converted Result</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <h2 className="break-all text-3xl font-black tracking-tight text-blue-600 sm:text-4xl">{convertedValue || "0"}</h2>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(convertedValue);
                    alert("Result copied successfully.");
                  }}
                  className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                >
                  Copy
                </button>
              </div>
              <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-600">
                {converterValue || "0"} {fromUnit} = {convertedValue || "0"} {toUnit}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setConverterValue("");
                  setConvertedValue("");
                  setFromUnit("Square Meter");
                  setToUnit("Square Feet");
                }}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-black text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}