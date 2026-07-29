"use client";

import { useEffect, useState } from "react";

import {
  X,
  Download,
  Printer,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface PDFViewerModalProps {
  open: boolean;
  title: string;
  fileId: string;
  onClose: () => void;
}

export default function PDFViewerModal({
  open,
  title,
  fileId,
  onClose,
}: PDFViewerModalProps) {
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () =>
      window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const toggleFullscreen = async () => {
    const element = document.getElementById("pdf-modal");

    if (!document.fullscreenElement) {
      await element?.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

const printPDF = async () => {
  try {
    const response = await fetch(`/api/print/${fileId}`);

    if (!response.ok) {
      throw new Error("Unable to load PDF");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.left = "-9999px";

    iframe.src = blobUrl;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };

    // ഉടൻ remove ചെയ്യരുത്.
    // Print dialog close ആകുന്നതുവരെ PDF memory-യിൽ ഇരിക്കട്ടെ.
    setTimeout(() => {
      try {
        iframe.remove();
        URL.revokeObjectURL(blobUrl);
      } catch {}
    }, 60000);

  } catch (error) {
    console.error(error);
    alert("Unable to print this PDF.");
  }
};

  return (
<div
  className="absolute inset-y-0 right-0 left-64 z-30 flex bg-black/10"
>
<div className="flex h-full w-full flex-col rounded-l-3xl border-l border-slate-200 bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">

          <div className="min-w-0">

            <h2 className="truncate text-lg font-bold text-slate-800">
              {title}
            </h2>

<div className="mt-1 flex items-center gap-2">

  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
    PDF
  </span>

  <span className="text-xs text-slate-500">
    Google Drive Preview
  </span>

</div>

          </div>

          <div className="flex min-w-[140px] items-center justify-center gap-2">

            <button
              onClick={toggleFullscreen}
              className="rounded-xl border border-slate-200 p-2 transition hover:bg-emerald-50 hover:border-emerald-300"
            >
              {fullscreen ? (
                <Minimize2 size={18} />
              ) : (
                <Maximize2 size={18} />
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-xl border p-2 hover:bg-red-50 hover:text-red-600"
            >
              <X size={20} />
            </button>

          </div>

        </div>
                {/* PDF Viewer */}

        <div className="relative flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">

              <div className="flex flex-col items-center">

                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />

<div className="mt-4 text-center">

  <p className="text-sm text-slate-600">
    Loading document...
  </p>

  <p className="mt-2 text-xs text-slate-400">
    Please wait while the PDF loads.
  </p>

</div>

              </div>

            </div>
          )}

          <iframe
            src={previewUrl}
            title={title}
            className="h-full w-full border-0"
            allow="autoplay"
            onLoad={() => setLoading(false)}
          />

        </div>

        {/* Footer */}

        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 bg-white px-6 py-3">

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-medium text-white transition hover:bg-emerald-600"
          >
            <Download size={18} />
            Download
          </a>

          <button
            onClick={printPDF}
            className="flex items-center gap-2 rounded-xl border px-5 py-3 font-medium transition hover:bg-emerald-50 hover:border-emerald-300"
          >
            <Printer size={18} />
            Print
          </button>

          <button
  onClick={() => {}}
  className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
>
  <FaWhatsapp size={20} />
  WhatsApp
</button>

        </div>

      </div>

    </div>
  );
}