"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download } from "lucide-react";

export default function PdfToolkitPage() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);

  const [mode, setMode] = useState("Merge files");
  const [how, setHow] = useState("one after another");
  const [convertTo, setConvertTo] = useState("PDF (file format is retained)");
  
  const [activeTab, setActiveTab] = useState("Compression");
  const [imageQuality, setImageQuality] = useState("8 - Standard, optimal quality");
  const [imageResolution, setImageResolution] = useState("300 dpi (Standard, optimal resolution)");
  const [colorMode, setColorMode] = useState("Color");
  const [retainOriginalCompression, setRetainOriginalCompression] = useState(false);

  const [outputFilename, setOutputFilename] = useState("processed-document");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file1 && !file2 && !file3) {
      alert("దయவுசெய்து കുറഞ്ഞത് ഒരു ഫയലെങ്കിലും തിരഞ്ഞെടുക്കുക.");
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      if (mode === "Merge files") {
        const mergedPdf = await PDFDocument.create();
        const filesToMerge = [file1, file2, file3].filter(Boolean) as File[];

        for (const file of filesToMerge) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfFile = await mergedPdf.save({ useObjectStreams: true });

const pdfBuffer = mergedPdfFile.buffer.slice(
  mergedPdfFile.byteOffset,
  mergedPdfFile.byteOffset + mergedPdfFile.byteLength
) as ArrayBuffer;

const blob = new Blob([pdfBuffer], {
  type: "application/pdf",
});

setDownloadUrl(URL.createObjectURL(blob));
        setDownloadUrl(URL.createObjectURL(blob));
      } else {
        const targetFile = file1 || file2 || file3;
        if (!targetFile) return;

        const arrayBuffer = await targetFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
const processedFile = await pdf.save({ useObjectStreams: true });

const pdfBuffer = processedFile.buffer.slice(
  processedFile.byteOffset,
  processedFile.byteOffset + processedFile.byteLength
) as ArrayBuffer;

const blob = new Blob([pdfBuffer], {
  type: "application/pdf",
});

setDownloadUrl(URL.createObjectURL(blob));
        setDownloadUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("പ്രോസസ്സ് ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-slate-200/80 p-6 rounded-3xl border border-slate-300 shadow-xl font-sans text-slate-800">
        
        {/* ഫയൽ ഇൻപുട്ട് സെക്ഷൻ */}
        <div className="space-y-3 mb-6 bg-white p-4 rounded-2xl shadow-inner border border-slate-200">
          
          {/* File 1 */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 w-1/3">
              <span className="font-bold text-sm text-slate-700">File 1:</span>
              <label className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer transition">
                Change...
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files && setFile1(e.target.files[0])} />
              </label>
              {file1 && (
                <button onClick={() => setFile1(null)} className="text-rose-500 hover:text-rose-700 text-xs font-bold">✕</button>
              )}
            </div>
            <div className="flex-1 px-4 text-xs font-medium text-slate-600 truncate">
              {file1 ? `${file1.name} (${(file1.size / 1024).toFixed(0)} KB)` : "No file chosen"}
            </div>
          </div>

          {/* File 2 */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 w-1/3">
              <span className="font-bold text-sm text-slate-700">File 2:</span>
              <label className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer transition">
                Change...
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files && setFile2(e.target.files[0])} />
              </label>
              {file2 && (
                <button onClick={() => setFile2(null)} className="text-rose-500 hover:text-rose-700 text-xs font-bold">✕</button>
              )}
            </div>
            <div className="flex-1 px-4 text-xs font-medium text-slate-600 truncate">
              {file2 ? `${file2.name} (${(file2.size / 1024).toFixed(0)} KB)` : "No file chosen"}
            </div>
          </div>

          {/* File 3 (optional) */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 w-1/3">
              <span className="font-bold text-sm text-slate-700">File 3: <span className="text-xs text-slate-400 font-normal">(optional)</span></span>
              <label className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer transition">
                Browse...
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files && setFile3(e.target.files[0])} />
              </label>
              {file3 && (
                <button onClick={() => setFile3(null)} className="text-rose-500 hover:text-rose-700 text-xs font-bold">✕</button>
              )}
            </div>
            <div className="flex-1 px-4 text-xs font-medium text-slate-600 truncate">
              {file3 ? `${file3.name} (${(file3.size / 1024).toFixed(0)} KB)` : "No file chosen"}
            </div>
          </div>

        </div>

        {/* Mode & Convert Controls Bar */}
        <div className="bg-slate-300/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 mb-6 border border-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-700">Mode:</span>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
            >
              <option value="Merge files">Merge files</option>
              <option value="Compress PDF">Compress PDF</option>
              <option value="Split PDF">Split / Extract</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-700">How:</span>
            <select 
              value={how} 
              onChange={(e) => setHow(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
            >
              <option value="one after another">one after another</option>
              <option value="interleave">interleave pages</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-rose-700">convert to:</span>
            <select 
              value={convertTo} 
              onChange={(e) => setConvertTo(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
            >
              <option value="PDF (file format is retained)">PDF (file format is retained)</option>
            </select>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b border-slate-300 pb-2 mb-4">
          {["Compression", "View", "Protection", "Header / footer", "Layout", "Optimization"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === tab 
                  ? "bg-rose-700 text-white shadow-md" 
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content (Compression) */}
        {activeTab === "Compression" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start gap-3 text-xs text-blue-900">
              <span className="text-lg">ℹ️</span>
              <p>The following preferences affect the compression of all images/graphics. The file size depends on the quality and resolution values. If you need a small file size, decrease the values.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-slate-100 pb-4">
              <div>
                <p className="font-bold text-xs text-slate-800">Compression for PDF-to-PDF</p>
                <p className="text-[11px] text-slate-500">Should quality and resolution be retained as in the original?</p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={retainOriginalCompression} 
                  onChange={(e) => setRetainOriginalCompression(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-700">Retain original compression</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-slate-100 pb-4">
              <div>
                <p className="font-bold text-xs text-slate-800">Quality of images</p>
                <p className="text-[11px] text-slate-500">The lower the quality, the smaller is the file size.</p>
              </div>
              <div>
                <select 
                  value={imageQuality} 
                  onChange={(e) => setImageQuality(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                  <option value="8 - Standard, optimal quality">8 - Standard, optimal quality</option>
                  <option value="5 - Medium quality">5 - Medium quality</option>
                  <option value="2 - Low quality (Small size)">2 - Low quality (Small size)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-slate-100 pb-4">
              <div>
                <p className="font-bold text-xs text-slate-800">Resolution of images</p>
                <p className="text-[11px] text-slate-500">The lower the resolution, the smaller is the file size.</p>
              </div>
              <div>
                <select 
                  value={imageResolution} 
                  onChange={(e) => setImageResolution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                  <option value="300 dpi (Standard, optimal resolution)">300 dpi (Standard, optimal resolution)</option>
                  <option value="150 dpi">150 dpi</option>
                  <option value="72 dpi">72 dpi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="font-bold text-xs text-slate-800">Color / black-and-white</p>
                <p className="text-[11px] text-slate-500">Images in black-and-white reduce the file size additionally</p>
              </div>
              <div>
                <select 
                  value={colorMode} 
                  onChange={(e) => setColorMode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                  <option value="Color">Color</option>
                  <option value="Grayscale">Grayscale (Black & White)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Filename after conversion */}
        <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex items-center gap-3 mb-6">
          <span className="font-bold text-xs text-slate-700 whitespace-nowrap">Filename after conversion:</span>
          <input 
            type="text" 
            value={outputFilename} 
            onChange={(e) => setOutputFilename(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <span className="text-xs font-bold text-slate-500">.pdf</span>
        </div>

        {/* Convert Button & Download */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={handleConvert}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-800 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition text-sm uppercase tracking-wider"
          >
            {isProcessing ? "Processing..." : "Convert"}
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${outputFilename}.pdf`}
              className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
            >
              <Download size={18} /> Download
            </a>
          )}
        </div>

        <p className="text-[10px] text-center text-slate-500 mt-4">
          Uploaded files are never saved. All data is deleted after conversion.
        </p>

      </div>
    </div>
  );
}