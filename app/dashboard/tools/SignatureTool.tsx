"use client";

import {
  RotateCcw,
  Save,
  Upload,
  ZoomIn,
  ZoomOut,
  FileSignature,
  RefreshCw,
  Info,
} from "lucide-react";

import { useSignature } from "../hooks/useSignature";

export default function SignatureTool() {
  const signature = useSignature();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* LEFT SIDE */}

      <section className="lg:col-span-7 space-y-4">

        {/* PREVIEW CARD */}

        <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-6">

          <div className="absolute left-4 top-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">
            PSC SIGNATURE PREVIEW
          </div>

          <div className="mt-8 flex flex-col items-center">

            <div
              className="relative flex cursor-grab items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg active:cursor-grabbing"
              style={{
                width: 210,
                height: 140,
              }}
              onWheel={(e) => {
                e.preventDefault();

                signature.setZoom((v: number) =>
                  Math.min(
                    300,
                    Math.max(
                      20,
                      v + (e.deltaY < 0 ? 10 : -10)
                    )
                  )
                );
              }}
              onMouseDown={(e) =>
                signature.startDrag(
                  e.clientX,
                  e.clientY
                )
              }
              onMouseMove={(e) =>
                signature.moveDrag(
                  e.clientX,
                  e.clientY
                )
              }
              onMouseUp={signature.stopDrag}
              onMouseLeave={signature.stopDrag}
            >
              {!signature.image ? (

                <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center text-slate-400">

                  <Upload size={28} />

                  <span className="mt-2 text-xs font-semibold">
                    Click to Upload
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={signature.upload}
                  />

                </label>

              ) : (

                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `
                      translate(${signature.position.x}px,
                                ${signature.position.y}px)
                      rotate(${signature.rotation}deg)
                      scale(${signature.zoom / 100})
                    `,
                  }}
                >

                  <img
                    src={signature.image}
                    alt="Signature Preview"
                    draggable={false}
                    className="pointer-events-none max-w-none select-none"
                    style={{
                      width: 200,
                    }}
                  />

                </div>

              )}

            </div>

            <div className="mt-4 flex items-center gap-2">

              <button
                onClick={() =>
                  signature.setZoom((v: number) =>
                    Math.min(v + 10, 300)
                  )
                }
                className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-100"
              >
                <ZoomIn size={14} />
              </button>

              <button
                onClick={() =>
                  signature.setZoom((v: number) =>
                    Math.max(v - 10, 20)
                  )
                }
                className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-100"
              >
                <ZoomOut size={14} />
              </button>

              <button
                onClick={() =>
                  signature.setRotation(
                    (v: number) => (v + 90) % 360
                  )
                }
                className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-100"
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={signature.reset}
                className="rounded-full border border-slate-200 bg-white p-2 hover:bg-slate-100"
              >
                <RefreshCw size={14} />
              </button>

            </div>

          </div>

        </div>

        {/* EDITOR CARD */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center gap-2 font-bold text-slate-700">

            <Info
              size={15}
              className="text-teal-600"
            />

            Editor Instructions

          </div>

          <ul className="mt-3 space-y-2 text-[12px] leading-5 text-slate-600">

            <li>
              Upload your signature image below.
            </li>

            <li>
              Use your mouse wheel to zoom.
            </li>

            <li>
              Click and drag to position it.
            </li>

            <li>
              Download output in PSC format.
            </li>

          </ul>

        </div>

      </section>
            {/* RIGHT SIDE */}

      <section className="lg:col-span-5 space-y-4">

        {/* UPLOAD CARD */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div>

            <h3 className="text-xl font-extrabold text-slate-800">
              Choose Signature Photo
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Output: <b>150 × 100 pixels</b>
            </p>

          </div>

          <label className="mt-5 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-500">

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={signature.upload}
            />

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Upload size={18} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-bold text-slate-700">
                  {signature.fileName || "Click to select signature"}
                </p>

                <p className="text-xs text-slate-400">
                  JPG, PNG
                </p>

              </div>

            </div>

          </label>

          <button
            disabled={!signature.image}
            onClick={signature.download}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >

            <Save size={16} />

            Download Signature

          </button>

          <button
            onClick={signature.reset}
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >

            Reset Canvas

          </button>

        </div>

        {/* SPECIFICATIONS */}

        <div className="rounded-2xl bg-slate-800 p-5 text-white shadow-lg">

          <div className="flex items-center gap-2 text-sm font-bold">

            <FileSignature size={15} />

            PSC Specifications

          </div>

          <div className="mt-5 space-y-3 text-sm">

            <div className="flex justify-between">

              <span className="text-slate-300">
                Dimensions
              </span>

              <span className="font-semibold">
                150 × 100 pixels
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-300">
                Resolution
              </span>

              <span className="font-semibold">
                200 DPI
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-300">
                File Size
              </span>

              <span className="font-semibold text-emerald-300">
                Below 30 KB
              </span>

            </div>

          </div>

        </div>

      </section>
          </div>
  );
}