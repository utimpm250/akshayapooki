"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";
import Tesseract from "tesseract.js";
import { extractWorkData } from "@/app/dashboard/work-status/parser";
import { addWork } from "@/app/dashboard/work-status/storage";

interface ImageToTextProps {
  onClose: () => void;
}

export default function ImageToTextTool({ onClose }: ImageToTextProps) {
  const [, setOcrImage] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  const handleFileToText = async (file: File) => {
    setOcrImage(file);
    setOcrLoading(true);
    setOcrText("");
    setOcrProgress(0);

    try {
      if (file.type === "application/pdf") {
        setOcrProgress(10);
        const pdfjsLib = await import("pdfjs-dist");

        // CORS & Codespaces എറർ പൂർണ്ണമായി ഒഴിവാക്കാൻ Worker Script Fetch ചെയ്ത് Blob URL ആക്കുന്നു
        try {
          const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
          const response = await fetch(workerUrl);
          const workerScript = await response.text();
          const blob = new Blob([workerScript], { type: "application/javascript" });
          pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
        } catch {
          // ഫെയിൽ ആയാൽ fallback ആയി direct unpkg URL നൽകുന്നു
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullExtractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          setOcrProgress(Math.round(20 + (i / pdf.numPages) * 30));
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            const renderTask = page.render({
  canvas,
  canvasContext: context,
  viewport,
});

await renderTask.promise;
            const imageUrl = canvas.toDataURL("image/png");
            
            const result = await Tesseract.recognize(imageUrl, "eng+mal", {
              logger: (m) => {
                if (m.status === "recognizing text") {
                  const pageProgress = Math.round((m.progress || 0) * (50 / pdf.numPages));
                  setOcrProgress(Math.min(90, 50 + pageProgress + ((i - 1) * (50 / pdf.numPages))));
                }
              },
            });
            fullExtractedText += `--- Page ${i} ---\n` + result.data.text + "\n\n";
          }
        }

        setOcrText(fullExtractedText);
        setOcrProgress(100);
      } else {
        // ഇമേജ് ഫയലുകൾക്കായി (JPG, PNG, WEBP)
        const imageUrl = URL.createObjectURL(file);
        
        const result = await Tesseract.recognize(imageUrl, "eng+mal", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setOcrProgress(Math.round((m.progress || 0) * 100));
            }
          },
        });
        
        setOcrText(result.data.text);
        const work = extractWorkData(result.data.text);

if (work) {
  addWork(work);
}
        URL.revokeObjectURL(imageUrl);
      }
    } catch (error: any) {
      console.error(error);
      alert(error?.message || JSON.stringify(error) || "Failed to extract text.");
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-950/70 p-2 backdrop-blur-md sm:p-3">
      <div className="flex h-[calc(100vh-1rem)] max-h-[760px] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:h-[calc(100vh-1.5rem)] sm:rounded-[28px]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3.5 backdrop-blur-xl sm:px-6 sm:py-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-800 sm:text-xl">Image & PDF To Text</h3>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 sm:text-xs">Extract text from images or PDF files instantly</p>
          </div>
          <button
            onClick={() => {
              onClose();
              setOcrImage(null);
              setOcrText("");
              setOcrProgress(0);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
          <div className="space-y-4">
            <div>
              <label className="group flex min-h-16 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-300/80 bg-orange-50/40 px-3 py-2 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-400 hover:bg-orange-50 hover:shadow-[0_14px_35px_rgba(249,115,22,0.12)] sm:min-h-20">
                <p className="text-base font-black text-slate-800">Browse Image or PDF</p>
                <p className="mt-1 text-xs font-medium text-slate-500">JPG • PNG • WEBP • PDF</p>
                <input
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileToText(file);
                    }
                  }}
                />
              </label>
            </div>

            {ocrLoading && (
              <div className="space-y-2 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-sm">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>Processing File & Extracting Text...</span>
                  <span>{ocrProgress}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all" style={{ width: `${ocrProgress}%` }} />
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-xs font-semibold text-slate-500 shadow-sm">
              {ocrText.length} Characters &nbsp;&nbsp; | &nbsp;&nbsp;
              {ocrText.trim() === "" ? 0 : ocrText.trim().split(/\s+/).length} Words &nbsp;&nbsp; | &nbsp;&nbsp;
              {ocrText.split("\n").length} Lines
            </div>

            <textarea
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              placeholder="Extracted text will appear here..."
              className="h-[180px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-inner outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 sm:h-[210px] lg:h-[240px]"
            />

            <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(ocrText);
                  alert("Text copied successfully.");
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-black sm:px-5 sm:py-3.5 text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Copy size={18} />
                Copy Text
              </button>

              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([ocrText], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "Extracted-Text.txt";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 font-black sm:px-5 sm:py-3.5 text-white shadow-[0_12px_30px_rgba(16,185,129,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Download TXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}