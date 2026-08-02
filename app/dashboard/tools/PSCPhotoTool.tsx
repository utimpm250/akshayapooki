"use client";

import React, { useState } from "react";
import { AlertCircle, Save, Upload, ZoomIn, ZoomOut } from "lucide-react";
import SignatureTool from "./SignatureTool";
import { usePSCPhoto } from "../hooks/usePSCPhoto";

interface PSCPhotoToolProps {
  onClose: () => void;
}

export default function PSCPhotoTool({
  onClose,
}: PSCPhotoToolProps) {
  const psc = usePSCPhoto();
  const [activeTab, setActiveTab] = useState<"photo" | "signature">("photo");

return (
  <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">

    <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col my-4 max-h-[95vh] overflow-y-auto">

      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white px-6 py-6 rounded-t-3xl flex items-center justify-between">

        <div>
          <h3 className="text-2xl font-extrabold">
            PSC Photo Creator
          </h3>

          <p className="text-xs text-teal-100">
            Kerala PSC standard photo & signature tools
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center"
        >
          ✕
        </button>

      </div>

      <div className="p-6">
        <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">

  <button
    onClick={() => setActiveTab("photo")}
    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
      activeTab === "photo"
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-700"
    }`}
  >
    PSC Photo
  </button>

  <button
    onClick={() => setActiveTab("signature")}
    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
      activeTab === "signature"
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-700"
    }`}
  >
    PSC Signature
  </button>

</div>

        {activeTab === "photo" ? (

<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-7">
            <div className="relative flex min-h-[490px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <span className="absolute left-4 top-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">PSC Photo Preview</span>
              <div className="absolute right-4 top-4 flex gap-2">
                <button onClick={() => psc.setZoom((value) => Math.min(value + 15, 400))} className="rounded-lg border bg-white p-2 text-slate-700 hover:bg-slate-100"><ZoomIn size={16} /></button>
                <button onClick={() => psc.setZoom((value) => Math.max(value - 15, 20))} className="rounded-lg border bg-white p-2 text-slate-700 hover:bg-slate-100"><ZoomOut size={16} /></button>
              </div>

              <div className="select-none overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-2xl" style={{ width: 225, height: 300 }} onWheel={(event) => { event.preventDefault(); psc.setZoom((value) => Math.min(400, Math.max(20, value + (event.deltaY < 0 ? 15 : -15)))); }} onMouseDown={(event) => psc.startDrag(event.clientX, event.clientY)} onMouseMove={(event) => psc.moveDrag(event.clientX, event.clientY)} onMouseUp={psc.stopDrag} onMouseLeave={psc.stopDrag}>
                <div className="relative flex items-center justify-center overflow-hidden bg-slate-100" style={{ width: 225, height: 247 }}>
                  {!psc.photo ? (
                    <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center text-slate-400">
                      <Upload size={26} /><span className="mt-2 text-xs font-semibold">Click to Upload</span>
                      <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={psc.uploadPhoto} />
                    </label>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translate(${psc.position.x}px, ${psc.position.y}px) scale(${psc.zoom / 100})` }}>
                      <img src={psc.photo} alt="PSC Preview" draggable={false} className="pointer-events-none max-w-none select-none object-contain" style={{ width: 225 }} />
                    </div>
                  )}
                </div>
                <div className="flex h-[27px] items-center justify-center border-t bg-white font-bold" style={{ fontSize: Math.max(14, psc.nameFontSize) }}>{(psc.applicantName || "NAME").toUpperCase()}</div>
                <div className="flex h-[26px] items-center justify-center bg-white text-slate-600" style={{ fontSize: Math.max(12, psc.dateFontSize) }}>{psc.photoDate || "DD-MM-YYYY"}</div>
              </div>
              <p className="absolute bottom-3 text-[11px] font-medium text-slate-400">Output: 150 × 200 px</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600"><p className="flex items-center gap-1.5 font-bold text-slate-800"><AlertCircle size={14} className="text-teal-600" /> Instructions</p><p className="mt-1">Mouse wheel ഉപയോഗിച്ച് zoom ചെയ്യുക. ഫോട്ടോ click ചെയ്ത് drag ചെയ്ത് ശരിയായ സ്ഥാനത്ത് വയ്ക്കുക.</p></div>
          </section>

          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:col-span-5">
            <div><h4 className="text-lg font-extrabold text-slate-800">Create PSC Photo</h4><p className="text-xs text-slate-500">Upload, position, then download.</p></div>
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4 hover:border-teal-400"><input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={psc.uploadPhoto} /><div className="flex items-center gap-3"><span className="rounded-xl bg-teal-50 p-3 text-teal-600"><Upload size={18} /></span><span className="min-w-0"><b className="block truncate text-xs text-slate-800">{psc.fileName || "Click to select photo"}</b><small className="text-slate-400">JPG, PNG</small></span></div></label>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Name of Applicant<input type="text" placeholder="Enter full name" value={psc.applicantName} onChange={(event) => psc.setApplicantName(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800" /></label>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Photo Taken Date<input type="text" placeholder="DD-MM-YYYY" value={psc.photoDate} onChange={(event) => psc.setPhotoDate(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800" /></label>
            <label className="block text-xs font-semibold text-slate-600">Name Font Size: {psc.nameFontSize}px<input type="range" min="10" max="24" value={psc.nameFontSize} onChange={(event) => psc.setNameFontSize(Number(event.target.value))} className="w-full accent-teal-600" /></label>
            <label className="block text-xs font-semibold text-slate-600">Date Font Size: {psc.dateFontSize}px<input type="range" min="8" max="20" value={psc.dateFontSize} onChange={(event) => psc.setDateFontSize(Number(event.target.value))} className="w-full accent-teal-600" /></label>
            <div className="flex gap-2 pt-2"><button disabled={!psc.photo} onClick={psc.download} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"><Save size={16} />Download Photo</button><button onClick={psc.reset} className="rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-100">Reset</button></div>
          </section>
        </div>

) : (

  <SignatureTool />

)}

      </div>

    </div>

  </div>
);
}