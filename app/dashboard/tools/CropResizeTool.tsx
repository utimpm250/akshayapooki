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
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">

      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col my-4 max-h-[95vh] overflow-y-auto">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-6 rounded-t-3xl flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-extrabold">
              Crop & Resize Image
            </h3>

            <p className="text-xs text-blue-100">
              Resize image with exact dimensions & file size
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X size={20} />
          </button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">

          {/* LEFT */}

          <section className="lg:col-span-7 space-y-4">

            <div className="relative rounded-3xl border border-slate-200 bg-slate-50 min-h-[520px] flex flex-col items-center justify-center p-6">

              <div className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Preview
              </div>

              <div className="absolute top-4 right-4 flex gap-2">

                <button
                  onClick={() =>
                    crop.setZoomLevel((v:number)=>Math.min(v+10,400))
                  }
                  className="rounded-lg border bg-white p-2"
                >
                  <ZoomIn size={16}/>
                </button>

                <button
                  onClick={() =>
                    crop.setZoomLevel((v:number)=>Math.max(v-10,20))
                  }
                  className="rounded-lg border bg-white p-2"
                >
                  <ZoomOut size={16}/>
                </button>

                <button
                  onClick={() =>
                    crop.setFineRotation((v:number)=>v+90)
                  }
                  className="rounded-lg border bg-white p-2"
                >
                  <RotateCcw size={16}/>
                </button>

              </div>

              <div
                className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-xl cursor-grab active:cursor-grabbing"
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

                  <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center text-slate-400">

                    <Upload size={32} />

                    <span className="mt-3 text-xs font-semibold">
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

              <div className="mt-5 text-xs text-slate-500">
                Drag image • Mouse wheel to zoom • Rotate freely
              </div>

            </div>

          </section>

          {/* RIGHT */}

          <section className="lg:col-span-5 space-y-4">

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">

              <div className="mb-5">

                <h3 className="text-xl font-extrabold text-slate-800">
                  Crop Settings
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Configure output size
                </p>

              </div>
                            <label className="block mb-4">

                <span className="text-xs font-bold uppercase text-slate-500">
                  Image
                </span>

                <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 hover:border-blue-500 transition">

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={crop.uploadImage}
                  />

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Upload size={18}/>
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold">
                      {crop.imageName || "Choose Image"}
                    </p>

                    <p className="text-xs text-slate-400">
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
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
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
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />

                </label>

              </div>

              <div className="mt-5 flex gap-2">

                <button
                  onClick={()=>
                    crop.setFineRotation(v=>v-90)
                  }
                  className="flex-1 rounded-xl border py-3 font-semibold"
                >
                  Rotate Left
                </button>

                <button
                  onClick={()=>
                    crop.setFineRotation(v=>v+90)
                  }
                  className="flex-1 rounded-xl border py-3 font-semibold"
                >
                  Rotate Right
                </button>

              </div>

              <button
                disabled={!crop.selectedImage}
                onClick={crop.handleProcessAndDownloadImage}
                className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Download size={17}/>
                Download Image
              </button>

              <button
                onClick={crop.reset}
                className="mt-3 w-full rounded-xl border py-3 font-semibold"
              >
                Reset
              </button>

            </div>
                        <div className="rounded-2xl bg-slate-800 text-white p-5">

              <div className="flex items-center gap-2 font-bold text-sm">
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