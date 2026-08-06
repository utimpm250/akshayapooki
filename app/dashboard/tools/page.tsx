"use client";

import { useState } from "react";
import {
  FileText,
  RefreshCcw,
  ScanText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import PDFTool from "./PDFTool";
import ConverterTool from "./ConverterTool";
import ImageToTextTool from "./ImageToText";

type ToolType = "home" | "pdf" | "converter" | "ocr";

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolType>("home");

  if (activeTool === "pdf") {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="flex items-center gap-3 border-b bg-white px-6 py-4">
          <button
            onClick={() => setActiveTool("home")}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-xl font-bold">PDF Tool</h1>
        </div>

        <PDFTool />
      </div>
    );
  }

  if (activeTool === "converter") {
    return (
      <ConverterTool
        onClose={() => setActiveTool("home")}
      />
    );
  }

  if (activeTool === "ocr") {
    return <ImageToTextTool />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Tools
            </h1>

            <p className="mt-2 text-slate-500">
              Choose a tool to continue.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border bg-white px-5 py-2 font-medium hover:bg-slate-100"
          >
            Dashboard
          </Link>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <button
            onClick={() => setActiveTool("pdf")}
            className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-left text-white shadow-lg transition hover:scale-[1.02]"
          >
            <div className="mb-6 flex items-center justify-between">
              <FileText size={34} />
            </div>

            <h2 className="text-xl font-bold">
              PDF Tool
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Merge, Split, Compress, Convert and manage PDF files.
            </p>
          </button>

          <button
            onClick={() => setActiveTool("converter")}
            className="rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-6 text-left text-white shadow-lg transition hover:scale-[1.02]"
          >
            <div className="mb-6 flex items-center justify-between">
              <RefreshCcw size={34} />
            </div>

            <h2 className="text-xl font-bold">
              Converter Tool
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Convert land units quickly and accurately.
            </p>
          </button>

          <button
            onClick={() => setActiveTool("ocr")}
            className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-left text-white shadow-lg transition hover:scale-[1.02]"
          >
            <div className="mb-6 flex items-center justify-between">
              <ScanText size={34} />
            </div>

            <h2 className="text-xl font-bold">
              Image To Text
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Extract editable text from images using OCR.
            </p>
          </button>
                  </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">
            Available Tools
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            PDF Tool helps you manage PDF files.
            Converter Tool converts land measurement units.
            Image To Text extracts editable text from images using OCR.
          </p>
        </div>

      </div>
    </div>
  );
}