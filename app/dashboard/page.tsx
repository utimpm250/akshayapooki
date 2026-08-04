"use client";

import SSLCCalculatorTool from "./tools/SSLCCalculatorTool";
import CashCounterTool from "./tools/CashCounterTool";
import PassportSize from "./tools/PassportSize";
import CropResizeTool from "./tools/CropResizeTool";
import PSCPhotoTool from "./tools/PSCPhotoTool";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import {
  FileText,
  Wallet,
  Search,
  DollarSign,
  ArrowUpRight,
  Bell,
  Megaphone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Settings,
  GripHorizontal,
  Save,
  Upload,
  FileCheck,
  Download,
  Trash2,
  Sliders,
  Layers,
  Scissors,
  Lock,
  Unlock,
  RotateCw,
} from "lucide-react";

interface WalletItem {
  id: string;
  name: string;
  openingBalance: number;
  currentBalance: number;
  lastUpdated: string;
}

interface ServiceItem {
  id?: string;
  title?: string;
  name?: string;
  serviceName?: string;
  url?: string;
  webUrl?: string;
  link?: string;
  note?: string;
}

interface QuickLinkItem {
  id: number | string;
  name: string;
  url: string;
  bgColor: string;
  isInternal: boolean;
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState({
    username: "Admin User",
    role: "admin",
  });

  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [todayEntriesCount, setTodayEntriesCount] = useState(0);
  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const [totalCashCollection, setTotalCashCollection] = useState(0);

  const [showAttendancePopup, setShowAttendancePopup] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [showUpdateBubble, setShowUpdateBubble] = useState(false);

  // Popup States for Tools
  const [showCashCounterModal, setShowCashCounterModal] = useState(false);
  const [showSslcModal, setShowSslcModal] = useState(false);
  const [showCropResizeModal, setShowCropResizeModal] = useState(false);
  const [showPassportToolModal, setShowPassportToolModal] = useState(false);
  const [showPscModal, setShowPscModal] = useState(false);
  const [showPdfToolkitModal, setShowPdfToolkitModal] = useState(false);

  // Advanced Online2PDF Style Toolkit States
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pdfAction, setPdfAction] = useState("convert"); 
  const [compressMode, setCompressMode] = useState("balanced");
  const [imageQuality, setImageQuality] = useState("8"); 
  const [imageResolution, setImageResolution] = useState("150"); 
  const [colorMode, setColorMode] = useState("keep"); 
  const [convertFormat, setConvertFormat] = useState("docx"); 
  const [pdfPassword, setPdfPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState("processed-document.pdf");

  const [showServiceDirectory, setShowServiceDirectory] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const draggedItemIndex = useRef<number | null>(null);
  const draggedOverItemIndex = useRef<number | null>(null);

  const currentVersion = "1.0.0";
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [quickLinks, setQuickLinks] = useState<QuickLinkItem[]>([
    {
      id: 1,
      name: "Resume Studio",
      url: "/dashboard/Tools/resume-studio",
      bgColor: "from-blue-500 to-blue-600",
      isInternal: true,
    },
    {
      id: 2,
      name: "SSLC Percentage",
      url: "sslc-modal",
      bgColor: "from-purple-500 to-purple-600",
      isInternal: true,
    },
    {
      id: 3,
      name: "Crop & Resize",
      url: "crop-resize-modal",
      bgColor: "from-pink-500 to-pink-600",
      isInternal: true,
    },
    {
      id: 4,
      name: "PSC Creator",
      url: "psc-modal",
      bgColor: "from-teal-500 to-teal-700",
      isInternal: true,
    },
    {
      id: 5,
      name: "Calculator",
      url: "/dashboard/Tools/calculator",
      bgColor: "from-amber-500 to-amber-600",
      isInternal: true,
    },
    {
      id: 6,
      name: "Cash Counter",
      url: "cash-counter-modal",
      bgColor: "from-emerald-500 to-emerald-600",
      isInternal: true,
    },
    {
      id: 7,
      name: "Passport Size",
      url: "passport-size-modal",
      bgColor: "from-rose-500 to-pink-600",
      isInternal: true,
    },
    {
      id: 8,
      name: "Online2PDF Suite",
      url: "pdf-toolkit-modal",
      bgColor: "from-indigo-600 to-violet-700",
      isInternal: true,
    },
  ]);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [serviceDirectory, setServiceDirectory] = useState<ServiceItem[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadDashboardData = () => {
      const savedWallets = localStorage.getItem("managedWallets");
      if (savedWallets) {
        try {
          setWallets(JSON.parse(savedWallets));
        } catch (e) {
          setWallets([]);
        }
      }

      const savedBills = localStorage.getItem("savedBills");
      if (savedBills) {
        try {
          const bills = JSON.parse(savedBills);
          setTodayEntriesCount(bills.length);
          setCompletedTodayCount(bills.length);
          const totalCash = bills.reduce(
            (acc: number, curr: any) =>
              acc + (Number(curr.totalAmount) || Number(curr.amount) || 0),
            0
          );
          setTotalCashCollection(totalCash);
        } catch (e) {}
      }

      const savedQuickLinksOrder = localStorage.getItem("dashboard_quick_links_order");
      let baseTools = quickLinks;
      if (savedQuickLinksOrder) {
        try {
          const parsedOrder = JSON.parse(savedQuickLinksOrder);
          if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
            baseTools = parsedOrder;
          }
        } catch (e) {}
      }

      const customHubLinks = localStorage.getItem("hub_quick_links");
      if (customHubLinks) {
        try {
          const parsedCustom = JSON.parse(customHubLinks);
          const formattedCustom = parsedCustom.map((item: any) => ({
            id: item.id || Date.now() + Math.random(),
            name: item.name || "External Tool",
            url: item.url || "#",
            bgColor: "from-indigo-500 to-violet-600",
            isInternal: false,
          }));
          setQuickLinks([...baseTools, ...formattedCustom]);
        } catch (e) {
          setQuickLinks(baseTools);
        }
      } else {
        setQuickLinks(baseTools);
      }

      let loadedServices: any[] = [];
      const possibleKeys = ["managedServices", "services", "service_management", "serviceList", "managed_services"];
      for (const key of possibleKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedServices = parsed;
              break;
            }
          } catch (err) {}
        }
      }

      const filteredWithUrls = loadedServices
        .map((s: any) => ({
          title: s.title || s.name || s.serviceName || "Untitled Service",
          url: s.portalUrl || s.url || s.webUrl || s.link || "",
          note: (s.portalUrl || s.url || s.webUrl || s.link || "").replace(/^https?:\/\//, ""),
        }))
        .filter((s) => s.url && s.url.trim() !== "");

      setServiceDirectory(filteredWithUrls);
    };

    loadDashboardData();

    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setTodayDate(
        now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser({
          username: parsed.username || "Admin User",
          role: parsed.role || "staff",
        });

        const logs = JSON.parse(localStorage.getItem("staff_attendance_logs") || "[]");
        const today = new Date().toISOString().split("T")[0];
        const alreadyMarked = logs.some(
          (log: any) =>
            log.staffName?.toLowerCase() === (parsed.username || "").toLowerCase() &&
            new Date(log.timestamp || log.date).toISOString().split("T")[0] === today
        );
        if (!alreadyMarked) setShowAttendancePopup(true);

        const savedVersion = localStorage.getItem("smart_akshaya_app_version") || "1.0.0";
        if (savedVersion !== currentVersion) setShowUpdateBubble(true);

        const savedAnnouncements = localStorage.getItem("hub_announcements");
        if (savedAnnouncements) {
          const parsedAnnouncements = JSON.parse(savedAnnouncements);
          const username = parsed.username || "Admin User";
          const hiddenKey = `hidden_notifications_${username}`;
          const hiddenIds = JSON.parse(localStorage.getItem(hiddenKey) || "[]");
          const filtered = parsedAnnouncements.filter((item: any) => {
            if (hiddenIds.includes(item.id)) return false;
            if (item.targetAll) return true;
            return item.selectedStaff?.includes(username);
          });
          setAnnouncements(filtered);
        }
      } catch (err) {}
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(timer);
    };
  }, []);

  const handleClearAllNotifications = () => {
    const username = currentUser.username;
    const hiddenKey = `hidden_notifications_${username}`;
    const hiddenIds = announcements.map((item) => item.id);
    localStorage.setItem(hiddenKey, JSON.stringify(hiddenIds));
    setAnnouncements([]);
  };

  const handleDragSort = () => {
    if (draggedItemIndex.current !== null && draggedOverItemIndex.current !== null) {
      const newQuickLinks = [...quickLinks];
      const draggedItemContent = newQuickLinks[draggedItemIndex.current];
      newQuickLinks.splice(draggedItemIndex.current, 1);
      newQuickLinks.splice(draggedOverItemIndex.current, 0, draggedItemContent);
      draggedItemIndex.current = null;
      draggedOverItemIndex.current = null;
      setQuickLinks(newQuickLinks);
    }
  };

  const handleSaveLayout = () => {
    localStorage.setItem("dashboard_quick_links_order", JSON.stringify(quickLinks));
    setIsCustomizing(false);
  };

  // Online2PDF Complete Functionality Engine
  const handleProcessPdf = async () => {
    if (selectedFiles.length === 0) {
      alert("ദയവായി കുറഞ്ഞത് ഒരു ഫയലെങ്കിലും തിരഞ്ഞെടുക്കുക.");
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const primaryFile = selectedFiles[0];
      const originalName = primaryFile.name.substring(0, primaryFile.name.lastIndexOf('.')) || primaryFile.name;

      if (pdfAction === "convert") {
        if (convertFormat === "jpg" || convertFormat === "png") {
          const arrayBuffer = await primaryFile.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password: pdfPassword || undefined });
          const pdfDoc = await loadingTask.promise;
          const page = await pdfDoc.getPage(1);

          const viewport = page.getViewport({ scale: Number(imageResolution) / 75 || 2.0 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({
  canvas: canvas,
  canvasContext: context,
  viewport,
}).promise;
            const mimeType = convertFormat === "png" ? "image/png" : "image/jpeg";
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setDownloadFileName(`${originalName}-converted.${convertFormat}`);
                setDownloadUrl(url);
              }
              setIsProcessing(false);
            }, mimeType, Number(imageQuality) / 10);
            return;
          }
        } else if (convertFormat === "txt" || convertFormat === "docx" || convertFormat === "xlsx") {
          const arrayBuffer = await primaryFile.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password: pdfPassword || undefined });
          const pdfDoc = await loadingTask.promise;
          let extractedText = "";

          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            extractedText += `--- Page ${i} ---\n${pageText}\n\n`;
          }

          if (convertFormat === "txt") {
            const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            setDownloadFileName(`${originalName}-converted.txt`);
            setDownloadUrl(url);
          } else {
            const htmlContent = `<html><head><meta charset='utf-8'></head><body><p>${extractedText.replace(/\n/g, '<br/>')}</p></body></html>`;
            const mimeType = convertFormat === "docx" 
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            
            const blob = new Blob([htmlContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            setDownloadFileName(`${originalName}-converted.${convertFormat}`);
            setDownloadUrl(url);
          }
        }
      } else if (pdfAction === "merge" || pdfAction === "compress") {
        const mergedPdf = await PDFDocument.create();

        for (const file of selectedFiles) {
          const arrayBuffer = await file.arrayBuffer();
          try {
            const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPages().map((_, i) => i));
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          } catch (err) {
            console.warn("Skipping file:", file.name);
          }
        }

const pdfBytes = await mergedPdf.save({ useObjectStreams: true });

const pdfBuffer = pdfBytes.buffer.slice(
  pdfBytes.byteOffset,
  pdfBytes.byteOffset + pdfBytes.byteLength
) as ArrayBuffer;

const blob = new Blob([pdfBuffer], {
  type: "application/pdf",
});

const url = URL.createObjectURL(blob);

setDownloadFileName(
  pdfAction === "merge"
    ? "merged-document.pdf"
    : "compressed-optimized.pdf"
);
setDownloadUrl(url);
setDownloadUrl(url);
      } else if (pdfAction === "protect") {
        const arrayBuffer = await primaryFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });   
        
const pdfBytes = await pdfDoc.save();

const pdfBuffer = pdfBytes.buffer.slice(
  pdfBytes.byteOffset,
  pdfBytes.byteOffset + pdfBytes.byteLength
) as ArrayBuffer;

const blob = new Blob([pdfBuffer], {
  type: "application/pdf",
});

        const url = URL.createObjectURL(blob);
        setDownloadFileName(`${originalName}-protected.pdf`);
        setDownloadUrl(url);
} else if (pdfAction === "split") {
  const arrayBuffer = await primaryFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const subDoc = await PDFDocument.create();
  const [firstPage] = await subDoc.copyPages(pdfDoc, [0]);
  subDoc.addPage(firstPage);

  const pdfBytes = await subDoc.save();

  const pdfBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;

  const blob = new Blob([pdfBuffer], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);

  setDownloadFileName(`${originalName}-split-page1.pdf`);
  setDownloadUrl(url);
}
    } catch (error) {
      console.error("Processing error:", error);
      alert("ഫയൽ പ്രോസസ്സ് ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു. പാസ്‌വേഡ് ശരിയാണോ എന്ന് പരിശോധിക്കുക.");
    } finally {
      setIsProcessing(false);
    }
  };

  const netWalletBalance = wallets.reduce((acc, curr) => acc + curr.currentBalance, 0);
  const isAdmin = currentUser.role.toLowerCase() === "admin";
  const displayRoleTitle = isAdmin ? "Admin User" : `${currentUser.username} User`;

  const filteredServices = serviceDirectory.filter(
    (s) =>
      (s.title && s.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.note && s.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-100/55 p-4 md:p-8">
      {showCashCounterModal && <CashCounterTool onClose={() => setShowCashCounterModal(false)} />}
      {showSslcModal && <SSLCCalculatorTool onClose={() => setShowSslcModal(false)} />}
      {showCropResizeModal && <CropResizeTool onClose={() => setShowCropResizeModal(false)} />}
      {showPassportToolModal && <PassportSize onClose={() => setShowPassportToolModal(false)} />}
      {showPscModal && <PSCPhotoTool onClose={() => setShowPscModal(false)} />}

      {/* Online2PDF Ultimate Suite Modal */}
      {showPdfToolkitModal && (
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
                  setShowPdfToolkitModal(false);
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
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <Upload size={14} /> Select Files (Multiple files allowed)
                </label>
                
                <label className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/40 hover:bg-indigo-900/40 transition rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer group text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition shadow-inner">
                    <Upload size={22} />
                  </div>
                  <span className="text-sm font-bold text-white">Click here to browse multiple files</span>
                  <span className="text-xs text-slate-400 mt-1">Supports PDF, Word, Excel, Images, Text</span>
                  <input
                    type="file"
                    multiple
                    accept="application/pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files);
                        setSelectedFiles((prev) => [...prev, ...newFiles]);
                        setDownloadUrl(null);
                      }
                    }}
                  />
                </label>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-xs font-semibold text-emerald-400">{selectedFiles.length} file(s) selected:</p>
                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="bg-indigo-900/30 border border-indigo-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileCheck size={16} className="text-emerald-400 shrink-0" />
                            <span className="font-medium text-white truncate">{file.name}</span>
                            <span className="text-indigo-300">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                              setDownloadUrl(null);
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Selection Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Choose Action / Mode</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { id: "convert", label: "Convert", icon: Layers },
                    { id: "compress", label: "Compress", icon: Sliders },
                    { id: "merge", label: "Merge PDF", icon: FileText },
                    { id: "protect", label: "Protect / Lock", icon: Lock },
                    { id: "split", label: "Split PDF", icon: Scissors },
                  ].map((act) => {
                    const IconComponent = act.icon;
                    return (
                      <button
                        key={act.id}
                        onClick={() => setPdfAction(act.id)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border flex items-center justify-center gap-1.5 ${
                          pdfAction === act.id
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                        }`}
                      >
                        <IconComponent size={14} /> {act.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {pdfAction === "convert" && (
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold uppercase text-indigo-300 flex items-center gap-1.5">
                    <Layers size={14} /> Conversion Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Convert File To:</label>
                      <select
                        value={convertFormat}
                        onChange={(e) => setConvertFormat(e.target.value)}
                        className="w-full bg-slate-900 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="docx">Microsoft Word (.docx)</option>
                        <option value="xlsx">Microsoft Excel (.xlsx)</option>
                        <option value="jpg">JPG Images (.jpg)</option>
                        <option value="png">PNG Images (.png)</option>
                        <option value="txt">Plain Text (.txt)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">PDF Password (if locked)</label>
                      <input
                        type="password"
                        placeholder="Enter password if required"
                        value={pdfPassword}
                        onChange={(e) => setPdfPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {pdfAction === "compress" && (
                <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold uppercase text-indigo-300 flex items-center gap-1.5">
                    <Sliders size={14} /> Compression Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Compression Mode</label>
                      <select
                        value={compressMode}
                        onChange={(e) => setCompressMode(e.target.value)}
                        className="w-full bg-slate-900 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="balanced">Balanced Quality & Size</option>
                        <option value="max-size">Maximum Size Reduction</option>
                        <option value="high-quality">High Quality Preservation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Image Quality: <span className="text-indigo-400 font-bold">{imageQuality} / 10</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={imageQuality}
                        onChange={(e) => setImageQuality(e.target.value)}
                        className="w-full accent-indigo-500 mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {pdfAction === "protect" && (
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-bold uppercase text-indigo-300 flex items-center gap-1.5">
                    <Lock size={14} /> Password Protection Settings
                  </h4>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Set New Owner/User Password</label>
                    <input
                      type="password"
                      placeholder="Enter secret password"
                      value={pdfPassword}
                      onChange={(e) => setPdfPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={handleProcessPdf}
                  disabled={isProcessing || selectedFiles.length === 0}
                  className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-xl transition text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Processing Document..." : "Convert / Process Now"}
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={downloadFileName}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transition flex items-center gap-2 text-sm shrink-0"
                  >
                    <Download size={18} /> Download
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAttendancePopup && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Good Day 👋</h2>
            <p className="text-slate-500 mb-6">Please mark your attendance to continue.</p>
            <div className="space-y-4">
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase">Staff</p>
                <p className="text-xl font-bold text-slate-800">{currentUser.username}</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase">Today</p>
                <p className="font-semibold">{todayDate}</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase">Current Time</p>
                <p className="text-2xl font-bold text-blue-600">{currentTime}</p>
              </div>
            </div>

            {attendanceSaved ? (
              <div className="mt-8 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                  <span className="text-5xl text-green-600">✓</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold text-green-600">Attendance Marked Successfully</h3>
              </div>
            ) : (
              <button
                onClick={() => {
                  try {
                    const logs = JSON.parse(localStorage.getItem("staff_attendance_logs") || "[]");
                    logs.push({
                      id: Date.now().toString(),
                      staffName: currentUser.username,
                      role: currentUser.role,
                      timestamp: new Date().toISOString(),
                      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    });
                    localStorage.setItem("staff_attendance_logs", JSON.stringify(logs));
                    setAttendanceSaved(true);
                    setTimeout(() => {
                      setShowAttendancePopup(false);
                      setAttendanceSaved(false);
                    }, 2000);
                  } catch (err) {}
                }}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold"
              >
                Mark Attendance
              </button>
            )}
          </div>
        </div>
      )}

      {showUpdateBubble && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-blue-600 text-white rounded-2xl shadow-xl p-4 w-72">
          <h3 className="font-bold text-lg">🚀 New Version Available</h3>
          <p className="text-sm mt-2">Click below to update your application.</p>
          <button
            onClick={() => {
              localStorage.setItem("smart_akshaya_app_version", currentVersion);
              setShowUpdateBubble(false);
              window.location.reload();
            }}
            className="mt-4 w-full bg-white text-blue-600 font-bold py-2 rounded-xl"
          >
            Update Now
          </button>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 mb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-700 transition"
            >
              <Bell size={20} />
              {announcements.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                    <p className="text-xs text-slate-500">{announcements.length} unread message(s)</p>
                  </div>
                  {announcements.length > 0 && (
                    <button
                      onClick={handleClearAllNotifications}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md transition"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                  {announcements.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">No new notifications.</div>
                  ) : (
                    announcements.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-slate-50/80 transition flex items-start gap-3 relative">
                        <span className="absolute top-4 left-3 w-2 h-2 bg-emerald-500 rounded-full mt-1"></span>
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 ml-2">
                          <Megaphone size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                            <span className="text-[10px] text-slate-400 shrink-0">{item.date}</span>
                          </div>
                          {item.subtitle && <p className="text-xs font-semibold text-slate-600 mt-0.5">{item.subtitle}</p>}
                          <p className="text-xs text-slate-500 mt-1">{item.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-2xl p-8 shadow-md flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase opacity-85 mb-1">{todayDate}</p>
            <h3 className="text-3xl font-extrabold">Welcome back, {currentUser.username}!</h3>
          </div>
          <div className="hidden sm:block text-right bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <p className="text-xs opacity-80 uppercase font-semibold">Logged in as</p>
            <p className="text-sm font-bold">{displayRoleTitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Today's Entries</p>
              <p className="text-2xl font-bold mt-1">{todayEntriesCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText size={22} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Completed Today</p>
              <p className="text-2xl font-bold mt-1">{completedTodayCount}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet size={22} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total Cash Collection</p>
              <p className="text-2xl font-bold mt-1">₹{totalCashCollection.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
              <DollarSign size={22} />
            </div>
          </div>

          <div
            onClick={() => setShowWalletDetails(!showWalletDetails)}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-fuchsia-300 transition"
          >
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                Net Wallet Balance {showWalletDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </p>
              <p className={`text-2xl font-bold mt-1 ${netWalletBalance < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                ₹{netWalletBalance.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-fuchsia-50 text-fuchsia-600 rounded-lg">
              <Wallet size={22} />
            </div>
          </div>
        </div>

        {showWalletDetails && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Wallet size={16} className="text-fuchsia-600" /> Individual Wallet Balances
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {wallets.map((w) => (
                <div key={w.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">{w.name}</span>
                  <span className={`text-lg font-black mt-2 ${w.currentBalance < 0 ? "text-rose-500" : "text-emerald-600"}`}>
                    ₹{w.currentBalance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-800">Quick Launch Tools</h4>
              <p className="text-xs text-slate-400">
                {isCustomizing ? "Drag and drop cards using your mouse to rearrange" : "Frequently used utilities"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isCustomizing ? (
                <button
                  onClick={() => setIsCustomizing(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  <Settings size={14} />
                  Customize Layout
                </button>
              ) : (
                <button
                  onClick={handleSaveLayout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition"
                >
                  <Save size={14} />
                  Save Layout
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {quickLinks.map((tool, index) => {
              const isCashCounter = tool.name.toLowerCase().includes("cash") || (tool.url && tool.url.toLowerCase().includes("cash"));
              const isSslc = tool.name.toLowerCase().includes("sslc") || (tool.url && tool.url.toLowerCase().includes("sslc"));
              const isCropResize = tool.name.toLowerCase().includes("crop") || (tool.url && tool.url.toLowerCase().includes("crop"));
              const isPsc = tool.name.toLowerCase().includes("psc") || (tool.url && tool.url.toLowerCase().includes("psc"));
              const isPassport = tool.name.toLowerCase().includes("passport") || (tool.url && tool.url.toLowerCase().includes("passport"));
              const isPdfTool = tool.name.toLowerCase().includes("pdf") || tool.url === "pdf-toolkit-modal";
              
              return (
                <div
                  key={`${tool.id}-${index}`}
                  draggable={isCustomizing}
                  onDragStart={() => (draggedItemIndex.current = index)}
                  onDragEnter={() => (draggedOverItemIndex.current = index)}
                  onDragEnd={handleDragSort}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative flex flex-col transition-transform ${isCustomizing ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  <a
                    href={isCustomizing || isCashCounter || isSslc || isCropResize || isPsc || isPassport || isPdfTool ? "#" : tool.url}
                    onClick={(e) => {
                      if (isCustomizing) {
                        e.preventDefault();
                        return;
                      }
                      
                      if (isCashCounter) {
                        e.preventDefault();
                        setShowCashCounterModal(true);
                      } else if (isSslc) {
                        e.preventDefault();
                        setShowSslcModal(true);
                      } else if (isCropResize) {
                        e.preventDefault();
                        setShowCropResizeModal(true);
                      } else if (isPsc) {
                        e.preventDefault();
                        setShowPscModal(true);
                      } else if (isPassport) {
                        e.preventDefault();
                        setShowPassportToolModal(true);
                      } else if (isPdfTool) {
                        e.preventDefault();
                        setShowPdfToolkitModal(true);
                      }
                    }}
                    target={tool.isInternal ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className={`flex flex-col justify-between p-5 bg-gradient-to-br ${
                      tool.bgColor || "from-indigo-500 to-violet-600"
                    } text-white rounded-2xl shadow-sm hover:opacity-95 transition h-28 ${
                      isCustomizing ? "ring-2 ring-blue-400 ring-offset-2 opacity-95" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <FileText size={22} />
                      {isCustomizing ? (
                        <GripHorizontal size={20} className="text-white/80" />
                      ) : (
                        !tool.isInternal && <ExternalLink size={16} className="opacity-75" />
                      )}
                    </div>
                    <div>
                      <span className="text-base font-bold block truncate">{tool.name}</span>
                      <span className="text-xs opacity-80">
                        {tool.isInternal || isCashCounter || isSslc || isCropResize || isPsc || isPassport || isPdfTool
                          ? "Internal Tool"
                          : "External Link"}
                      </span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div 
            onClick={() => setShowServiceDirectory(!showServiceDirectory)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Service Directory
              </span>
              <h4 className="text-lg font-bold text-slate-800">Quickly Access Any Service</h4>
            </div>
            <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition">
              {showServiceDirectory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {showServiceDirectory && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-2">
              <div className="relative w-full max-w-lg mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search for a service..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {filteredServices.length === 0 ? (
                  <div className="col-span-full py-8 text-slate-400 text-sm">No services with URLs found matching your search.</div>
                ) : (
                  filteredServices.map((service, index) => (
                    <a
                      key={index}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50/30 transition text-left group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-blue-600 transition">{service.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{service.note}</p>
                      </div>
                      <ArrowUpRight size={16} className="text-slate-400 shrink-0 group-hover:text-blue-600 transition" />
                    </a>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}