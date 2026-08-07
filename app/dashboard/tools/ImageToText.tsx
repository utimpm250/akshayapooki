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
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Image & PDF To Text</h3>
            <p className="text-sm text-slate-500">Extract text from images or PDF files instantly</p>
          </div>
          <button
            onClick={() => {
              onClose();
              setOcrImage(null);
              setOcrText("");
              setOcrProgress(0);
            }}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-orange-300 rounded-xl py-6 px-3 cursor-pointer hover:bg-orange-50 transition">
                <p className="text-base font-semibold text-slate-700">Browse Image or PDF</p>
                <p className="text-xs text-slate-500 mt-1">JPG • PNG • WEBP • PDF</p>
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
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-700">
                  <span>Processing File & Extracting Text...</span>
                  <span>{ocrProgress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all" style={{ width: `${ocrProgress}%` }} />
                </div>
              </div>
            )}

            <div className="text-xs text-slate-500 border rounded-xl px-4 py-2 bg-slate-50">
              {ocrText.length} Characters &nbsp;&nbsp; | &nbsp;&nbsp;
              {ocrText.trim() === "" ? 0 : ocrText.trim().split(/\s+/).length} Words &nbsp;&nbsp; | &nbsp;&nbsp;
              {ocrText.split("\n").length} Lines
            </div>

            <textarea
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              placeholder="Extracted text will appear here..."
              className="w-full h-[300px] rounded-2xl border border-slate-300 p-4 outline-none resize-none text-slate-800"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(ocrText);
                  alert("Text copied successfully.");
                }}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center gap-2"
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
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
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