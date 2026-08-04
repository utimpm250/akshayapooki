"use client";

import { useEffect, useRef, useState } from "react";
import { drawPassportSheet } from "../lib/passportCanvas";

export type PaperType = "A4" | "6x4";

export interface PassportPhotoState {
  image: string | null;
  imageName: string;
  paperType: PaperType;
  copies: number;
  borderSize: number;
  backgroundColor: string;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  zoom: number;
  rotation: number;
  imagePosition: {
    x: number;
    y: number;
  };
}

export function usePassportSize() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);

  const dragStartRef = useRef({
    x: 0,
    y: 0,
  });

  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [paperType, setPaperType] = useState<PaperType>("A4");
  const [copies, setCopies] = useState(8);
  const [borderSize, setBorderSize] = useState(5);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [zoom, setZoom] = useState(1); // സ്റ്റാൻഡേർഡ് സൂം 1 ആയി നിർത്തുക
  const [rotation, setRotation] = useState(0);
  const [imagePosition, setImagePosition] = useState({
    x: 0,
    y: 0,
  });

  const [cropOpen, setCropOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const resetAll = () => {
    setImage(null);
    setImageName("");
    setPaperType("A4");
    setCopies(8);
    setBorderSize(5);
    setBackgroundColor("#ffffff");
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHue(0);
    setZoom(1); // ഇവിടെയും 1 ആക്കി മാറ്റുക
    setRotation(0);
    setImagePosition({ x: 0, y: 0 });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);
    const reader = new FileReader();

    reader.onload = () => {
      const img = reader.result as string;
      setZoom(1); // 0.65 ന് പകരം 1 വെക്കുക
      setCropImage(img);
      setCropOpen(true);
    };

    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setImageName(file.name);
    const reader = new FileReader();

    reader.onload = () => {
      const img = reader.result as string;
      setZoom(1); // 0.65 ന് പകരം 1 വെക്കുക
      setCropImage(img);
      setCropOpen(true);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    setImagePosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    if (!image) {
      if (previewCanvasRef.current) {
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        canvas.width = 0;
        canvas.height = 0;
      }
      return;
    }

    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const sheet = drawPassportSheet({
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

      if (!sheet) return;

      previewCanvas.width = sheet.width;
      previewCanvas.height = sheet.height;

      previewCanvas.style.width = "100%";
      previewCanvas.style.height = "100%";
      previewCanvas.style.objectFit = "contain";

      const ctx = previewCanvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      ctx.drawImage(sheet, 0, 0, previewCanvas.width, previewCanvas.height);
    };
  }, [
    image,
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
  ]);

  return {
    previewContainerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    fileInputRef,
    canvasRef,
    previewCanvasRef,
    image,
    imageName,
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
    setImagePosition,
    handleSelectImage,
    openFilePicker,
    handleDrop,
    handleDragOver,
    cropOpen,
    setCropOpen,
    croppedImage,
    setCroppedImage,
    cropImage,
    setCropImage,
    setImage,
    resetAll,
  };
}