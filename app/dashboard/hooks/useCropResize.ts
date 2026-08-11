"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type Position = {
  x: number;
  y: number;
};

export function useCropResize() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");

  const [targetWidth, setTargetWidth] = useState("150");
  const [targetHeight, setTargetHeight] = useState("200");
  const [selectedUnit, setSelectedUnit] = useState("px");

  const [minKb, setMinKb] = useState("15");
  const [maxKb, setMaxKb] = useState("30");

  const [zoomLevel, setZoomLevel] = useState(100);
  const [fineRotation, setFineRotation] = useState(0);

  const [removeBackground, setRemoveBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessingBackground, setIsProcessingBackground] = useState(false);

  const [imagePosition, setImagePosition] = useState<Position>({
    x: 0,
    y: 0,
  });

  const isDraggingImageRef = useRef(false);

  const dragStartRef = useRef<Position>({
    x: 0,
    y: 0,
  });

  const getComputedDimensions = () => {
    const rawW = parseFloat(targetWidth) || 150;
    const rawH = parseFloat(targetHeight) || 200;

    if (selectedUnit === "cm") {
      return {
        width: Math.max(1, Math.round(rawW * 37.795)),
        height: Math.max(1, Math.round(rawH * 37.795)),
      };
    }

    if (selectedUnit === "inch") {
      return {
        width: Math.max(1, Math.round(rawW * 96)),
        height: Math.max(1, Math.round(rawH * 96)),
      };
    }

    return {
      width: Math.max(1, Math.round(rawW)),
      height: Math.max(1, Math.round(rawH)),
    };
  };

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(String(reader.result));
      setProcessedImage(null);
      setZoomLevel(100);
      setFineRotation(0);
      setImagePosition({ x: 0, y: 0 });
    };

    reader.readAsDataURL(file);
  };

  const startDrag = (x: number, y: number) => {
    isDraggingImageRef.current = true;

    dragStartRef.current = {
      x: x - imagePosition.x,
      y: y - imagePosition.y,
    };
  };

  const moveDrag = (x: number, y: number) => {
    if (!isDraggingImageRef.current) return;

    setImagePosition({
      x: x - dragStartRef.current.x,
      y: y - dragStartRef.current.y,
    });
  };

  const stopDrag = () => {
    isDraggingImageRef.current = false;
  };

  const imageUrlToBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not read image.");
    return response.blob();
  };

  const renderNormalCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!selectedImage) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = getComputedDimensions();
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((fineRotation * Math.PI) / 180);
        const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight) * (zoomLevel / 100);
        ctx.scale(scale, scale);
        ctx.translate(imagePosition.x, imagePosition.y);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.restore();
        resolve(canvas);
      };
      img.onerror=()=>resolve(null);
      img.src=selectedImage;
    });
  };

  const renderProcessedCanvas = async (transparentUrl: string): Promise<HTMLCanvasElement | null> => {
    const img = new Image();
    await new Promise<void>((resolve,reject)=>{
      img.onload=()=>resolve();
      img.onerror=()=>reject(new Error("Could not load processed image."));
      img.src=transparentUrl;
    });
    const { width,height }=getComputedDimensions();
    const canvas=document.createElement("canvas");
    canvas.width=width; canvas.height=height;
    const ctx=canvas.getContext("2d");
    if(!ctx) return null;
    ctx.fillStyle=backgroundColor;
    ctx.fillRect(0,0,width,height);
    ctx.save();
    ctx.translate(width/2,height/2);
    ctx.rotate((fineRotation*Math.PI)/180);
    const scale=Math.max(width/img.naturalWidth,height/img.naturalHeight)*(zoomLevel/100);
    ctx.scale(scale,scale);
    ctx.translate(imagePosition.x,imagePosition.y);
    ctx.drawImage(img,-img.naturalWidth/2,-img.naturalHeight/2);
    ctx.restore();
    return canvas;
  };

  const renderCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (removeBackground && processedImage) {
      return renderProcessedCanvas(processedImage);
    }
    return renderNormalCanvas();
  };

  const [displayImage, setDisplayImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!selectedImage || !removeBackground) {
      setProcessedImage(null);
      setDisplayImage(selectedImage);
      setIsProcessingBackground(false);
      return;
    }

    const process = async () => {
      setIsProcessingBackground(true);
      setProcessedImage(null);
      setDisplayImage(null);

      try {
        const { removeBackground: removeBg } = await import("@imgly/background-removal");
        const sourceBlob = await imageUrlToBlob(selectedImage);
        const resultBlob = await removeBg(sourceBlob, {
          output: { format: "image/png" },
        });

        if (cancelled) return;
        const url = URL.createObjectURL(resultBlob);
        setProcessedImage(url);
      } catch (error) {
        console.error("Background removal failed:", error);
      } finally {
        if (!cancelled) setIsProcessingBackground(false);
      }
    };

    process();
    return () => { cancelled = true; };
  }, [selectedImage, removeBackground]);

  useEffect(() => {
    let cancelled=false;
    if(!selectedImage) { setDisplayImage(null); return; }
    if(!removeBackground) { setDisplayImage(selectedImage); return; }
    if(!processedImage) return;

    renderProcessedCanvas(processedImage).then(canvas=>{
      if(!cancelled && canvas) setDisplayImage(canvas.toDataURL("image/jpeg",0.95));
    });
    return ()=>{cancelled=true;};
  }, [selectedImage,processedImage,removeBackground,backgroundColor,zoomLevel,fineRotation,
      imagePosition.x,imagePosition.y,targetWidth,targetHeight,selectedUnit]);

  const handleProcessAndDownloadImage = async () => {
    const canvas = await renderCanvas();
    if (!canvas) return;

    let quality = 0.95;
    const maxBytes = Math.max(1, (parseInt(maxKb) || 30) * 1024);

    const save = () => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          if (blob.size > maxBytes && quality > 0.1) {
            quality = Math.max(0.1, quality - 0.05);
            save();
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = url;
          link.download =
            imageName.replace(/\.[^/.]+$/, "") + "-processed.jpg";

          document.body.appendChild(link);
          link.click();
          link.remove();

          setTimeout(() => URL.revokeObjectURL(url), 1000);
        },
        "image/jpeg",
        quality
      );
    };

    save();
  };

  const reset = () => {
    setSelectedImage(null);
    setImageName("");

    setTargetWidth("150");
    setTargetHeight("200");
    setSelectedUnit("px");

    setMinKb("15");
    setMaxKb("30");

    setZoomLevel(100);
    setFineRotation(0);

    setRemoveBackground(false);
    setBackgroundColor("#ffffff");
    setProcessedImage(null);
    setIsProcessingBackground(false);

    setImagePosition({ x: 0, y: 0 });
  };

  return {
    selectedImage,
    imageName,

    targetWidth,
    setTargetWidth,

    targetHeight,
    setTargetHeight,

    selectedUnit,
    setSelectedUnit,

    minKb,
    setMinKb,

    maxKb,
    setMaxKb,

    zoomLevel,
    setZoomLevel,

    fineRotation,
    setFineRotation,

    removeBackground,
    setRemoveBackground,
    backgroundColor,
    setBackgroundColor,
    processedImage,
    displayImage,
    isProcessingBackground,

    imagePosition,

    uploadImage,

    startDrag,
    moveDrag,
    stopDrag,

    reset,

    getComputedDimensions,

    handleProcessAndDownloadImage,
  };
}
