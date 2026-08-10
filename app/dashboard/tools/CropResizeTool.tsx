"use client";

import {
  Upload,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crop,
  X,
} from "lucide-react";

import { useCropResize } from "../hooks/useCropResize";

interface CropResizeToolProps {
  onClose: () => void;
}

export default function CropResizeTool({
  onClose,
}: CropResizeToolProps) {
  const crop = useCropResize();

  const { width: previewWidth, height: previewHeight } =
    crop.getComputedDimensions();

  const previewAspect =
    previewWidth / (previewHeight || 1);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-md sm:p-5">

      <div className="my-4 flex max-h-[95vh] w-full max-w-6xl flex-col overflow-y-auto rounded-[30px] border border-white/80 bg-white/95 shadow-[0_30px_100px_rgba(15,23,42,0.28)] backdrop-blur-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 px-5 py-5 text-white shadow-lg sm:px-7 sm:py-6">

          <div>

            <h3 className="text-2xl font-black tracking-tight">
              Crop & Resize Image
            </h3>

            <p className="text-xs font-medium text-blue-50/90">
              Resize image with exact dimensions & file size
            </p>

          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-white/20"
          >
            <X size={20} />
          </button>

        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-12 lg:gap-5 lg:p-6">

          {/* LEFT */}

          <section className="lg:col-span-7 space-y-4">

            <div className="relative flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm sm:min-h-[520px] sm:p-6">

              <div className="absolute left-4 top-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Preview
              </div>

              <div className="absolute right-4 top-4 flex gap-2">

                <button
                  onClick={() =>
                    crop.setZoomLevel((v:number)=>Math.min(v+10,400))
                  }
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <ZoomIn size={16}/>
                </button>

                <button
                  onClick={() =>
                    crop.setZoomLevel((v:number)=>Math.max(v-10,20))
                  }
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <ZoomOut size={16}/>
                </button>

                <button
                  onClick={() =>
                    crop.setFineRotation((v:number)=>v+90)
                  }
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <RotateCcw size={16}/>
                </button>

              </div>

              <div
                className="relative cursor-grab overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)] active:cursor-grabbing"
                style={{
                  width:
                    previewAspect >= 1
                      ? 300
                      : 300 * previewAspect,

                  height:
                    previewAspect >= 1
                      ? 300 / previewAspect
                      : 300,
                }}
                                onWheel={(e) => {
                  e.preventDefault();

                  crop.setZoomLevel((v: number) =>
                    Math.min(
                      400,
                      Math.max(
                        20,
                        v + (e.deltaY < 0 ? 10 : -10)
                      )
                    )
                  );
                }}
                onMouseDown={(e) =>
                  crop.startDrag(
                    e.clientX,
                    e.clientY
                  )
                }
                onMouseMove={(e) =>
                  crop.moveDrag(
                    e.clientX,
                    e.clientY
                  )
                }
                onMouseUp={crop.stopDrag}
                onMouseLeave={crop.stopDrag}
              >

                {!crop.selectedImage ? (

                  <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white text-slate-400 transition-colors hover:text-blue-500">

                    <Upload size={32} />

                    <span className="mt-3 text-xs font-bold">
                      Click to Upload Image
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={crop.uploadImage}
                    />

                  </label>

                ) : (

                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `
                        translate(${crop.imagePosition.x}px,
                        ${crop.imagePosition.y}px)
                        rotate(${crop.fineRotation}deg)
                        scale(${crop.zoomLevel / 100})
                      `,
                    }}
                  >

                    <img
                      src={crop.selectedImage}
                      alt="Preview"
                      draggable={false}
                      className="pointer-events-none max-w-none select-none"
                      style={{
                        width: 220,
                      }}
                    />

                  </div>

                )}

              </div>

              <div className="mt-5 rounded-xl bg-white/70 px-3 py-2 text-center text-xs font-medium text-slate-500 shadow-sm">
                Drag image • Mouse wheel to zoom • Rotate freely
              </div>

            </div>

          </section>

          {/* RIGHT */}

          <section className="lg:col-span-5 space-y-4">

            <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-6">

              <div className="mb-5">

                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  Crop Settings
                </h3>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Configure output size
                </p>

              </div>
                            <label className="block mb-4">

                <span className="text-xs font-bold uppercase text-slate-500">
                  Image
                </span>

                <label className="group mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md">

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={crop.uploadImage}
                  />

                  <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3 text-white shadow-lg shadow-blue-500/20">
                    <Upload size={18}/>
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-black text-slate-800">
                      {crop.imageName || "Choose Image"}
                    </p>

                    <p className="text-xs font-medium text-slate-400">
                      JPG • PNG • WEBP
                    </p>

                  </div>

                </label>

              </label>

              <div className="grid grid-cols-2 gap-3">

                <label>

                  <span className="text-xs font-bold uppercase text-slate-500">
                    Width
                  </span>

                  <input
                    value={crop.targetWidth}
                    onChange={(e)=>
                      crop.setTargetWidth(e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </label>

                <label>

                  <span className="text-xs font-bold uppercase text-slate-500">
                    Height
                  </span>

                  <input
                    value={crop.targetHeight}
                    onChange={(e)=>
                      crop.setTargetHeight(e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </label>

              </div>

              <label className="block mt-4">

                <span className="text-xs font-bold uppercase text-slate-500">
                  Unit
                </span>

                <select
                  value={crop.selectedUnit}
                  onChange={(e)=>
                    crop.setSelectedUnit(e.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >

                  <option value="px">Pixels</option>
                  <option value="cm">Centimeter</option>
                  <option value="inch">Inch</option>

                </select>

              </label>

              <div className="grid grid-cols-2 gap-3 mt-4">

                <label>

                  <span className="text-xs font-bold uppercase text-slate-500">
                    Min KB
                  </span>

                  <input
                    value={crop.minKb}
                    onChange={(e)=>
                      crop.setMinKb(e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </label>

                <label>

                  <span className="text-xs font-bold uppercase text-slate-500">
                    Max KB
                  </span>

                  <input
                    value={crop.maxKb}
                    onChange={(e)=>
                      crop.setMaxKb(e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                </label>

              </div>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">

                <button
                  onClick={()=>
                    crop.setFineRotation(v=>v-90)
                  }
                  className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white py-3 font-black text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                >
                  Rotate Left
                </button>

                <button
                  onClick={()=>
                    crop.setFineRotation(v=>v+90)
                  }
                  className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white py-3 font-black text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                >
                  Rotate Right
                </button>

              </div>

              <button
                disabled={!crop.selectedImage}
                onClick={crop.handleProcessAndDownloadImage}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3.5 font-black text-white shadow-[0_14px_32px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(37,99,235,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={17}/>
                Download Image
              </button>

              <button
                onClick={crop.reset}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white py-3 font-black text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
              >
                Reset
              </button>

            </div>
                        <div className="rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">

              <div className="flex items-center gap-2 text-sm font-black">
                <Crop size={16} />
                Output Information
              </div>

              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-300">Width</span>
                  <span>{crop.targetWidth} {crop.selectedUnit}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-300">Height</span>
                  <span>{crop.targetHeight} {crop.selectedUnit}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-300">Size Limit</span>
                  <span>
                    {crop.minKb} KB - {crop.maxKb} KB
                  </span>
                </div>

              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}