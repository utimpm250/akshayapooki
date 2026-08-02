"use client";

import { ChangeEvent, useRef, useState } from "react";

type Position = {
  x: number;
  y: number;
};

export function useSignature() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
  });

  const dragging = useRef(false);

  const dragStart = useRef<Position>({
    x: 0,
    y: 0,
  });

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setZoom(100);
      setRotation(0);
      setPosition({
        x: 0,
        y: 0,
      });
    };

    reader.readAsDataURL(file);
  };

  const startDrag = (x: number, y: number) => {
    dragging.current = true;

    dragStart.current = {
      x: x - position.x,
      y: y - position.y,
    };
  };

  const moveDrag = (x: number, y: number) => {
    if (!dragging.current) return;

    setPosition({
      x: x - dragStart.current.x,
      y: y - dragStart.current.y,
    });
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  const reset = () => {
    setImage(null);
    setFileName("");
    setZoom(100);
    setRotation(0);
    setPosition({
      x: 0,
      y: 0,
    });
  };

  const download = () => {
    if (!image) return;

    const img = new Image();

    img.src = image;

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = 150;
      canvas.height = 100;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 150, 100);

      ctx.save();

      ctx.beginPath();
      ctx.rect(0, 0, 150, 100);
      ctx.clip();

      ctx.translate(75, 50);

      ctx.rotate((rotation * Math.PI) / 180);

      const scale = (150 / img.width) * (zoom / 100);

      ctx.scale(scale, scale);

      ctx.translate(position.x, position.y);

      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2
      );

      ctx.restore();

      let quality = 0.9;

      const save = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return;

            if (
              blob.size > 30 * 1024 &&
              quality > 0.1
            ) {
              quality -= 0.05;
              save();
              return;
            }

            const url = URL.createObjectURL(blob);

            const link =
              document.createElement("a");

            link.href = url;
            link.download = "psc_signature.jpg";
            link.click();

            URL.revokeObjectURL(url);
          },
          "image/jpeg",
          quality
        );
      };

      save();
    };
  };

  return {
    image,
fileName,
upload,
zoom,
setZoom,
rotation,
setRotation,
position,
startDrag,
moveDrag,
stopDrag,
reset,
download,
  };
}