"use client";

import { ChangeEvent, useRef, useState } from "react";

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

  const [imagePosition, setImagePosition] = useState<Position>({
    x: 0,
    y: 0,
  });

  const isDraggingImageRef = useRef(false);

  const dragStartRef = useRef<Position>({
    x: 0,
    y: 0,
  });

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result as string);

      setZoomLevel(100);
      setFineRotation(0);

      setImagePosition({
        x: 0,
        y: 0,
      });
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

    setImagePosition({
      x: 0,
      y: 0,
    });
  };  const getComputedDimensions = () => {
    const rawW = parseFloat(targetWidth) || 150;
    const rawH = parseFloat(targetHeight) || 200;

    if (selectedUnit === "cm") {
      return {
        width: Math.round(rawW * 37.795),
        height: Math.round(rawH * 37.795),
      };
    }

    if (selectedUnit === "inch") {
      return {
        width: Math.round(rawW * 96),
        height: Math.round(rawH * 96),
      };
    }

    return {
      width: Math.round(rawW),
      height: Math.round(rawH),
    };
  };

  const handleProcessAndDownloadImage = () => {
    if (!selectedImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedImage;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const { width: outW, height: outH } = getComputedDimensions();

      canvas.width = outW;
      canvas.height = outH;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);

      ctx.save();

      ctx.translate(outW / 2, outH / 2);

      ctx.rotate((fineRotation * Math.PI) / 180);

      const scale = Math.max(
        outW / img.width,
        outH / img.height
      ) * (zoomLevel / 100);

      ctx.scale(scale, scale);

      ctx.translate(
        imagePosition.x,
        imagePosition.y
      );

      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2
      );

      ctx.restore();

      let quality = 0.95;

      const saveImage = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return;

            const maxBytes =
              (parseInt(maxKb) || 30) * 1024;

            if (
              blob.size > maxBytes &&
              quality > 0.1
            ) {
              quality -= 0.05;
              saveImage();
              return;
            }

            const url =
              URL.createObjectURL(blob);

            const link =
              document.createElement("a");

            link.href = url;
            link.download =
              imageName || "cropped-image.jpg";

            link.click();

            URL.revokeObjectURL(url);
          },
          "image/jpeg",
          quality
        );
      };

      saveImage();
    };
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