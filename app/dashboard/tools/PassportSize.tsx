"use client";

import {
  Camera,
  Download,
  RefreshCcw,
  Upload,
  X,
} from "lucide-react";

import { usePassportSize } from "../hooks/usePassportSize";
import { drawPassportSheet } from "../lib/passportCanvas";
import PassportCropDialog from "../components/PassportCropDialog";

interface PassportSizeProps {
  onClose?: () => void;
}

export default function PassportSize({
  onClose,
}: PassportSizeProps) {
  const {
    fileInputRef,
    previewContainerRef,
    previewCanvasRef,
    image,
    imagePosition,
    paperType,
    copies,
    borderSize,
    backgroundColor,
    brightness,
    contrast,
    saturation,
    hue,
    zoom,
    rotation,
    setPaperType,
    setCopies,
    setBorderSize,
    setBackgroundColor,
    setBrightness,
    setContrast,
    setSaturation,
    setHue,
    setZoom,
    setRotation,
    handleSelectImage,
    openFilePicker,
    handleDrop,
    handleDragOver,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    cropOpen,
    setCropOpen,
    cropImage,
    setCropImage,
    setImage,
    resetAll,
  } = usePassportSize();

  const handleDownload = async () => {
    if (!image) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const canvas = drawPassportSheet({
        image: img,
        paperType,
        copies,
        borderSize,
        backgroundColor,
        brightness,
        contrast,
        saturation,
        hue,
        zoom,
        rotation,
        imagePosition,
      });

      if (!canvas) return;

      const link = document.createElement("a");
      link.download = "passport-photo-sheet.jpg";
      link.href = canvas.toDataURL("image/png", 1);
      link.click();
    };
  };

  const handleCropSave = (cropped: string) => {
    setImage(cropped);
    setCropImage(null);
    setCropOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm overflow-auto">
        <div className="min-h-screen p-6 flex items-center justify-center">
          <div className="w-full max-w-[950px] rounded-[24px] overflow-hidden bg-[#f5f7fb] shadow-2xl">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ef3b5d] to-[#c7174d] px-8 py-6 flex items-center justify-between text-white">
              <div>
                <h1 className="text-[28px] font-black leading-none">
                  Passport Photo Creator
                </h1>
                <p className="mt-3 text-white/90 text-sm">
                  Generate and print multi-photo sheets
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={openFilePicker}
                  className="w-12 h-12 rounded-2xl bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
                >
                  <Camera size={24} />
                </button>

                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-14 h-14 rounded-2xl bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
                  >
                    <X size={22} />
                  </button>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleSelectImage}
            />

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6 p-6">
              
              {/* ===========================
                  LEFT PANEL (Live Preview)
              =========================== */}
              <div className="rounded-[20px] bg-white border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Live Preview
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {paperType === "A4"
                      ? "A4 Paper (210 × 297 mm)"
                      : '6" × 4" Paper (152 × 102 mm)'}
                  </span>
                </div>

                <div className="p-6">
                  <div
                    ref={previewContainerRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    className="min-h-[520px] rounded-xl bg-[#f5f7fb] border border-slate-200 flex items-center justify-center overflow-hidden"
                  >
                    <div
                      className={`bg-white border border-slate-300 shadow-sm flex items-center justify-center overflow-hidden ${
                        paperType === "A4"
                          ? "w-[360px] h-[510px]"
                          : "w-[430px] h-[286px]"
                      }`}
                    >
                      <canvas
                        ref={previewCanvasRef}
                        className="w-full h-full object-contain bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-7">
                    <button
                      type="button"
                      disabled={!image}
                      onClick={handleDownload}
                      className="w-[300px] h-12 rounded-xl bg-slate-200 text-white font-semibold enabled:bg-[#ef174f] enabled:hover:bg-[#db1348] transition flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Sheet
                    </button>
                  </div>
                </div>
              </div>

              {/* ===========================
                  RIGHT PANEL
              =========================== */}
              <div className="space-y-5">
                
                {/* Initial Source & Background */}
                <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-500">
                    Initial Source & Background
                  </h3>

                  <div
                    onClick={openFilePicker}
                    className="mt-5 h-[92px] rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition"
                  >
                    <Upload size={20} className="text-slate-500 mb-2" />
                    <p className="text-xs text-slate-600">
                      Choose Photo or Drag & Drop
                    </p>
                  </div>
                </div>

                {/* Print Parameters */}
                <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-500 mb-5">
                    Print Parameters
                  </h3>

                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">
                        Paper Size
                      </label>
                      <select
                        value={paperType}
                        onChange={(e) =>
                          setPaperType(e.target.value as "A4" | "6x4")
                        }
                        className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                      >
                        <option value="A4">A4 Paper</option>
                        <option value="6x4">6 × 4 Paper</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">
                        Bg Color
                      </label>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="mt-2 h-10 w-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">
                        Number of Copies
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={copies}
                        onChange={(e) => setCopies(Number(e.target.value))}
                        className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">
                        Border Size (px)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={borderSize}
                        onChange={(e) => setBorderSize(Number(e.target.value))}
                        className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Fine Tuning */}
                <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-500 mb-5">
                    Fine Tuning Adjustments
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Brightness</label>
                      <input type="range" min={0} max={200} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="mt-1 w-full" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Contrast</label>
                      <input type="range" min={0} max={200} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="mt-1 w-full" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Saturation</label>
                      <input type="range" min={0} max={200} value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="mt-1 w-full" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Zoom</label>
                      <input type="range" min={50} max={250} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Rotation</label>
                      <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="mt-1 w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetAll}
                      className="h-11 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2 font-semibold"
                    >
                      <RefreshCcw size={16} />
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={!image}
                      className="h-11 rounded-xl bg-[#ef174f] hover:bg-[#da1448] disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 font-semibold"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Crop Dialog Component */}
      <PassportCropDialog
        open={cropOpen}
        image={cropImage}
        onCancel={() => setCropOpen(false)}
        onSave={handleCropSave}
      />
    </>
  );
}