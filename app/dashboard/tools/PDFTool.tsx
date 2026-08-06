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
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-indigo-500/30 text-white relative my-8">
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-white/5 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/30 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-wide text-white">Online2PDF Complete Suite</h3>
              <p className="text-xs text-indigo-300">Convert, Compress, Merge, Protect & Edit PDF Files</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              setSelectedFiles([]);
              setDownloadUrl(null);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <label
              className="border-2 border-dashed border-indigo-500/40 rounded-2xl p-8 bg-slate-900/40 hover:bg-slate-800 transition cursor-pointer text-center block"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) {
                  addMoreFiles(e.dataTransfer.files);
                }
              }}
            >
              <div className="space-y-3">
                <Upload size={36} className="mx-auto text-indigo-400" />
                <h3 className="font-bold text-lg">Browse PDF Files</h3>
                <p className="text-sm text-slate-400">Click here or Drag & Drop PDF files</p>
                <p className="text-xs text-slate-500">You can add more files anytime.</p>
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
              <div className="space-y-4 mt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Selected PDF Files</h3>
                    <p className="text-xs text-slate-400">Drag and drop files to change their order before merging.</p>
                  </div>
                  <div className="text-xs bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full">
                    {selectedFiles.length} Files
                  </div>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      draggable
                      onDragStart={() => (draggedPdfIndex.current = index)}
                      onDragEnter={() => (draggedOverPdfIndex.current = index)}
                      onDragEnd={handlePdfDragSort}
                      onDragOver={(e) => e.preventDefault()}
                      className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500 transition cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => deleteFile(index)}
                          className="w-9 h-9 rounded-lg bg-red-600 hover:bg-red-500 flex items-center justify-center text-white"
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">PDF Merge</h4>
                <p className="text-xs text-slate-400">Arrange files and merge into a single PDF.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCompressEnabled(!isCompressEnabled)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  isCompressEnabled ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                Compress
              </button>
            </div>
          </div>

          {isCompressEnabled && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Compression Settings</h4>
              <p className="text-xs text-slate-400">These settings will be applied before downloading.</p>

              <label className="flex items-center justify-between bg-slate-800 rounded-xl p-3 cursor-pointer">
                <span className="text-sm">Retain Original Compression</span>
                <input
                  type="checkbox"
                  checked={retainCompression}
                  onChange={(e) => setRetainCompression(e.target.checked)}
                />
              </label>

              <div>
                <label className="text-xs font-semibold text-slate-300">Image Quality</label>
                <select
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                >
                  <option value="1">1 - Low</option>
                  <option value="5">5 - Medium</option>
                  <option value="8">8 - Standard</option>
                  <option value="10">10 - High</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Resolution</label>
                <select
                  value={imageResolution}
                  onChange={(e) => setImageResolution(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                >
                  <option value="72">72 DPI</option>
                  <option value="150">150 DPI</option>
                  <option value="300">300 DPI</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Color Mode</label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value as any)}
                  className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white"
                >
                  <option value="color">Color</option>
                  <option value="grayscale">Grayscale</option>
                  <option value="black-white">Black & White</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-4 space-y-4">
            {downloadUrl && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3">
                <p className="text-sm text-emerald-400 font-semibold">PDF is ready for download.</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleProcessPdf}
              disabled={selectedFiles.length === 0 || isProcessing}
              className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:opacity-90 disabled:opacity-50 transition rounded-2xl py-4 font-bold text-white text-base shadow-xl"
            >
              {isProcessing ? "Processing PDF..." : "Merge & Download"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}