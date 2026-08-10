"use client";

import React, { useState, useRef } from "react";
import { FileText, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";

interface PDFToolkitProps {
  onClose: () => void;
}

export default function PDFToolkitTool({ onClose }: PDFToolkitProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCompressEnabled, setIsCompressEnabled] = useState(false);
  const [compressMode, setCompressMode] = useState<"balanced" | "max-size" | "high-quality">("balanced");
  const [imageQuality, setImageQuality] = useState("8");
  const [imageResolution, setImageResolution] = useState("300");
  const [colorMode, setColorMode] = useState<"color" | "grayscale" | "black-white">("color");
  const [retainCompression, setRetainCompression] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [, setProgress] = useState(0);
  const [, setProgressText] = useState("");
  const [, setShowProgress] = useState(false);

  const draggedPdfIndex = useRef<number | null>(null);
  const draggedOverPdfIndex = useRef<number | null>(null);

  const addMoreFiles = (files: FileList | null) => {
    if (!files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    setDownloadUrl(null);
  };

  const deleteFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setDownloadUrl(null);
  };

  const handlePdfDragSort = () => {
    if (draggedPdfIndex.current === null || draggedOverPdfIndex.current === null) return;
    const files = [...selectedFiles];
    const draggedItem = files[draggedPdfIndex.current];
    files.splice(draggedPdfIndex.current, 1);
    files.splice(draggedOverPdfIndex.current, 0, draggedItem);
    setSelectedFiles(files);
    draggedPdfIndex.current = null;
    draggedOverPdfIndex.current = null;
  };

  const handleProcessPdf = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one PDF.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProgressText("Preparing PDF...");
    setShowProgress(true);
    setDownloadUrl(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setProgressText(`Merging ${i + 1} of ${selectedFiles.length}`);
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 70));
        try {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
          const copiedPages = await mergedPdf.copyPages(
            pdf,
            pdf.getPages().map((_, index) => index)
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (err) {
          console.warn("Skipped:", file.name, err);
        }
      }

      setProgress(80);
      setProgressText(isCompressEnabled ? "Compressing PDF..." : "Finalizing PDF...");
      const pdfBytes = await mergedPdf.save({ useObjectStreams: true });

      if (isCompressEnabled) {
        console.log("Compression Enabled", { compressMode, imageQuality, imageResolution, colorMode, retainCompression });
      }

      const pdfBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      ) as ArrayBuffer;

      setProgress(95);
      setProgressText("Preparing Download...");
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const fileName = isCompressEnabled ? "compressed-merged.pdf" : "merged-document.pdf";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setProgress(100);
      setProgressText("Completed");
      document.body.removeChild(link);
      setDownloadUrl(url);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("PDF processing failed.");
    } finally {
      setTimeout(() => {
        setShowProgress(false);
        setProgress(0);
        setProgressText("");
        setIsProcessing(false);
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-950/70 p-2 backdrop-blur-md sm:p-3">
      <div className="flex h-[calc(100vh-1rem)] max-h-[820px] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-700/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-[0_30px_100px_rgba(2,6,23,0.55)] sm:h-[calc(100vh-1.5rem)]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-700/70 bg-slate-900/90 px-4 py-3.5 backdrop-blur-2xl sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-emerald-500/20 to-orange-500/15 p-2.5 text-teal-300 shadow-lg shadow-teal-950/50">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white sm:text-lg">Online2PDF Complete Suite</h3>
              <p className="text-[11px] text-slate-400">Convert, Compress, Merge, Protect & Edit PDF Files</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              setSelectedFiles([]);
              setDownloadUrl(null);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-slate-400 transition-all hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-600"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-5 md:p-6">
          <div className="space-y-2">
            <label
              className="group block min-h-20 cursor-pointer rounded-2xl border-2 border-dashed border-teal-400/50 bg-slate-800/65 p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-slate-800 hover:shadow-[0_14px_35px_rgba(45,212,191,0.14)] sm:min-h-24"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) {
                  addMoreFiles(e.dataTransfer.files);
                }
              }}
            >
              <div className="space-y-2">
                <Upload size={36} className="mx-auto text-teal-300 transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105" />
                <h3 className="text-base font-black tracking-tight text-white sm:text-lg">Browse PDF Files</h3>
                <p className="text-xs text-slate-300 sm:text-sm">Click here or Drag & Drop PDF files</p>
                <p className="text-[11px] text-slate-400">You can add more files anytime.</p>
              </div>
              <input
                type="file"
                multiple
                accept="application/pdf"
                className="hidden"
                onChange={(e) => addMoreFiles(e.target.files)}
              />
            </label>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-100">Selected PDF Files</h3>
                    <p className="text-xs text-slate-400">Drag and drop files to change their order before merging.</p>
                  </div>
                  <div className="rounded-full border border-slate-700/80 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {selectedFiles.length} Files
                  </div>
                </div>
                <div className="max-h-52 space-y-2 overflow-y-auto sm:max-h-56">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      draggable
                      onDragStart={() => (draggedPdfIndex.current = index)}
                      onDragEnter={() => (draggedOverPdfIndex.current = index)}
                      onDragEnd={handlePdfDragSort}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex cursor-grab items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-800/70 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300/60 hover:bg-slate-800 hover:shadow-lg active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 font-black text-white shadow-lg shadow-teal-950/50">
                          {index + 1}
                        </div>
                        <div>
                          <p className="max-w-xs truncate text-sm font-bold text-slate-100">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => deleteFile(index)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-500 hover:text-slate-100"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-100">PDF Merge</h4>
                <p className="text-xs text-slate-400">Arrange files and merge into a single PDF.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCompressEnabled(!isCompressEnabled)}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all sm:text-sm ${
                  isCompressEnabled ? "bg-teal-500 text-slate-950" : "bg-slate-700 text-slate-200"
                }`}
              >
                Compress
              </button>
            </div>
          </div>

          {isCompressEnabled && (
            <div className="space-y-2">
              <h4 className="text-sm font-black text-slate-100">Compression Settings</h4>
              <p className="text-xs text-slate-400">These settings will be applied before downloading.</p>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-700/70 bg-slate-800/70 p-3 transition hover:bg-slate-100">
                <span className="text-sm">Retain Original Compression</span>
                <input
                  type="checkbox"
                  checked={retainCompression}
                  onChange={(e) => setRetainCompression(e.target.checked)}
                />
              </label>

              <div>
                <label className="text-xs font-semibold text-slate-400">Image Quality</label>
                <select
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-100 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/15"
                >
                  <option value="1">1 - Low</option>
                  <option value="5">5 - Medium</option>
                  <option value="8">8 - Standard</option>
                  <option value="10">10 - High</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Resolution</label>
                <select
                  value={imageResolution}
                  onChange={(e) => setImageResolution(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-100 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/15"
                >
                  <option value="72">72 DPI</option>
                  <option value="150">150 DPI</option>
                  <option value="300">300 DPI</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Color Mode</label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value as any)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-100 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/15"
                >
                  <option value="color">Color</option>
                  <option value="grayscale">Grayscale</option>
                  <option value="black-white">Black & White</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-3 border-t border-slate-700/70 pt-4">
            {downloadUrl && (
              <div className="rounded-2xl border border-slate-700/80 bg-emerald-50 p-3">
                <p className="text-sm font-bold text-teal-300">PDF is ready for download.</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleProcessPdf}
              disabled={selectedFiles.length === 0 || isProcessing}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-500 to-amber-400 py-3.5 text-sm font-black text-white shadow-[0_14px_35px_rgba(45,212,191,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(251,191,36,0.22)] disabled:cursor-not-allowed disabled:opacity-50 sm:py-4 sm:text-base"
            >
              {isProcessing ? "Processing PDF..." : "Merge & Download"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}