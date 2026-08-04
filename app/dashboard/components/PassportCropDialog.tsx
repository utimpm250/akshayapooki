"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  X,
  Check,
  ZoomIn,
  RotateCw,
} from "lucide-react";

interface PassportCropDialogProps {
  open: boolean;
  image: string | null;
  onCancel: () => void;
  onSave: (image: string) => void;
}

export default function PassportCropDialog({
  open,
  image,
  onCancel,
  onSave,
}: PassportCropDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragging = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

const cropWidth = 280;
  const cropHeight = 360;

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      imageRef.current = img;
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });

      requestAnimationFrame(() => {
        drawCanvas();
      });
    };
  }, [image]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, cw, ch);

    const centerX = cw / 2;
    const centerY = ch / 2;

    ctx.save();
    ctx.translate(centerX + offset.x, centerY + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);

    const baseScale = Math.max(
      cropWidth / img.width,
      cropHeight / img.height
    );
    const scale = baseScale * zoom;

    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    const left = centerX - cropWidth / 2;
    const top = centerY - cropHeight / 2;

    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    ctx.strokeRect(left, top, cropWidth, cropHeight);

    ctx.beginPath();
    ctx.moveTo(left + cropWidth / 3, top);
    ctx.lineTo(left + cropWidth / 3, top + cropHeight);

    ctx.moveTo(left + (cropWidth * 2) / 3, top);
    ctx.lineTo(left + (cropWidth * 2) / 3, top + cropHeight);

    ctx.moveTo(left, top + cropHeight / 3);
    ctx.lineTo(left + cropWidth, top + cropHeight / 3);

    ctx.moveTo(left, top + (cropHeight * 2) / 3);
    ctx.lineTo(left + cropWidth, top + (cropHeight * 2) / 3);

    ctx.stroke();
    ctx.restore();
  }, [zoom, rotation, offset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    dragging.current = true;
    lastPoint.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return;

    const dx = e.clientX - lastPoint.current.x;
    const dy = e.clientY - lastPoint.current.y;

    lastPoint.current = { x: e.clientX, y: e.clientY };

    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prevZoom) => Math.min(Math.max(0.5, prevZoom + zoomFactor), 3));
  };

  const handleSaveCroppedImage = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = cropWidth;
    outputCanvas.height = cropHeight;
    const outCtx = outputCanvas.getContext("2d");

    if (!outCtx) return;

    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, cropWidth, cropHeight);

    const centerX = outputCanvas.width / 2;
    const centerY = outputCanvas.height / 2;

    outCtx.save();
    outCtx.translate(centerX + offset.x, centerY + offset.y);
    outCtx.rotate((rotation * Math.PI) / 180);

    const baseScale = Math.max(
      cropWidth / img.width,
      cropHeight / img.height
    );
    const scale = baseScale * zoom;

    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    outCtx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    outCtx.restore();

    const dataUrl = outputCanvas.toDataURL("image/jpeg", 0.95);
    onSave(dataUrl);
  };

  if (!open || !image) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden bg-white shadow-2xl">
        
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <div>
            <h2 className="text-lg font-bold">Crop Passport Photo</h2>
            <p className="text-xs text-slate-500">
              Adjust, drag or scroll to zoom your photo inside the box.
            </p>
          </div>

          <button
            onClick={onCancel}
            className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative h-[380px] bg-[#f1f5f9] flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={700}
            height={380}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="cursor-move w-full h-full object-contain"
          />
        </div>

        <div className="border-t bg-white px-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 font-semibold text-xs mb-1">
                <ZoomIn size={16} />
                Zoom
              </label>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold text-xs mb-1">
                <RotateCw size={16} />
                Rotation
              </label>
              <input
                type="range"
                min={-180}
                max={180}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onCancel}
              className="px-4 h-9 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveCroppedImage}
              className="px-4 h-9 rounded-xl bg-[#ef174f] hover:bg-[#db1348] text-white flex items-center gap-2 text-xs font-semibold"
            >
              <Check size={16} />
              Use Photo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}