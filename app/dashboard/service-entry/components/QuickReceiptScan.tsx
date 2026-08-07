"use client";

import { useEffect, useRef, useState } from "react";
import { ScanText } from "lucide-react";
import Tesseract from "tesseract.js";
import { extractWorkData } from "../../work-status/parser";
import { addWork } from "../../work-status/storage";

export default function QuickReceiptScan() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;

      if (!items) return;

      for (const item of items) {
        if (item.kind !== "file") continue;

        const file = item.getAsFile();

        if (!file) continue;

        await handleFile(file);
        break;
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleFile = async (file: File) => {
    setLoading(true);
    setMessage("");

    try {
      const result = await Tesseract.recognize(file, "eng+mal");
      console.log("========== OCR ==========");
      console.log(result.data.text);
      console.log("=========================");

      const text = result.data.text;

      // alert(text); // Removed to get rid of the OK button popup

const work = extractWorkData(text);

if (work) {
  const loggedUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "{}"
  );

  const receiptUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);

    reader.readAsDataURL(file);
  });

  work.addedBy = loggedUser.username || "";
  work.staff = loggedUser.username || "";
  work.receiptUrl = receiptUrl;
  work.receiptType = file.type.includes("pdf")
    ? "pdf"
    : "image";

  addWork(work);

  setMessage("✅ Saved to Work Status");
} else {
  setMessage("⚠️ Required fields not detected.");
}
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to scan document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[280px] h-[64px] rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-3 flex items-center">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
          <ScanText size={20} />
        </div>

        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest text-white/70">
            QUICK SCAN
          </p>

          <p className="text-sm font-semibold text-white truncate">
            Paste Image
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="rounded-lg bg-white text-indigo-700 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap"
        >
          {loading ? "Scanning..." : "Browse Image"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              handleFile(file);
            }
          }}
        />

        {message && (
          <div
            className={`mt-3 text-xs font-medium ${
              message.startsWith("✅")
                ? "text-emerald-200"
                : message.startsWith("⚠️")
                ? "text-yellow-200"
                : "text-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}