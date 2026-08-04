import {
  Area,
} from "react-easy-crop";

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
) {
  const image = new Image();

  image.src = imageSrc;

  await new Promise((r) => {
    image.onload = r;
  });

  const canvas =
    document.createElement("canvas");

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error();
  }

  canvas.width = pixelCrop.width;

  canvas.height = pixelCrop.height;

  ctx.save();

  ctx.translate(
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.rotate(
    (rotation * Math.PI) / 180
  );

ctx.drawImage(
  image,
  pixelCrop.x,
  pixelCrop.y,
  pixelCrop.width,
  pixelCrop.height,
  0,
  0,
  canvas.width,
  canvas.height
);

  ctx.restore();

  return canvas.toDataURL(
    "image/png"
  );
}