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
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Land Area Converter</h3>
            <p className="text-xs text-slate-500">Convert between Square Meter, Square Feet, Cent, Are, Hectare and Acre.</p>
          </div>
          <button
            onClick={() => {
              onClose();
              setConverterValue("");
              setConvertedValue("");
              setFromUnit("Square Meter");
              setToUnit("Square Feet");
            }}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Enter Value</label>
              <input
                type="number"
                value={converterValue}
                onChange={(e) => setConverterValue(e.target.value)}
                placeholder="Enter value"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-4 items-end w-full">
              <div className="w-full">
                <label className="block text-sm font-semibold text-slate-700 mb-2">From Unit</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800"
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
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold transition flex items-center justify-center"
                >
                  ⇄
                </button>
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-slate-700 mb-2">To Unit</label>
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

            <div className="rounded-2xl bg-slate-100 p-5 text-center">
              <p className="text-sm text-slate-500">Converted Result</p>
              <div className="flex items-center justify-center gap-3 mt-2">
                <h2 className="text-3xl font-bold text-blue-600 break-all">{convertedValue || "0"}</h2>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(convertedValue);
                    alert("Result copied successfully.");
                  }}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                >
                  Copy
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-600 font-medium">
                {converterValue || "0"} {fromUnit} = {convertedValue || "0"} {toUnit}
              </p>
            </div>

            <div className="flex justify-end mt-5">
              <button
                type="button"
                onClick={() => {
                  setConverterValue("");
                  setConvertedValue("");
                  setFromUnit("Square Meter");
                  setToUnit("Square Feet");
                }}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition"
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