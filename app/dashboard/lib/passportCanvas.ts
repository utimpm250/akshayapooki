export interface PassportCanvasOptions {
  image: HTMLImageElement;
  copies: number;
  paperType: "A4" | "6x4";
  zoom: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  backgroundColor: string;
  borderSize: number; // ഇനി ഇത് ബോർഡറിന്റെ കട്ടിയായി (LineWidth) ഉപയോഗിക്കാം
  imagePosition: {
    x: number;
    y: number;
  };
}

const MM_TO_PX = 3.7795275591;

export const PASSPORT_WIDTH = 35 * MM_TO_PX;

export const PASSPORT_HEIGHT = 45 * MM_TO_PX;

export const A4_WIDTH = 210 * MM_TO_PX;

export const A4_HEIGHT = 297 * MM_TO_PX;

export const PAPER_6X4_WIDTH = 152.4 * MM_TO_PX;

export const PAPER_6X4_HEIGHT = 101.6 * MM_TO_PX;

const PAGE_MARGIN = 10;

const PHOTO_GAP = 10;

export function createPassportCanvas(
  options: PassportCanvasOptions
) {
  const canvas = document.createElement("canvas");

  let paperWidth = A4_WIDTH;
  let paperHeight = A4_HEIGHT;

  if (options.paperType === "6x4") {
    paperWidth = PAPER_6X4_WIDTH;
    paperHeight = PAPER_6X4_HEIGHT;
  }

  canvas.width = Math.round(paperWidth);
  canvas.height = Math.round(paperHeight);

  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return {
    canvas,
    ctx,
  };
}

function calculateLayout(
  canvas: HTMLCanvasElement,
  options: PassportCanvasOptions
) {
  const photoWidth = PASSPORT_WIDTH;
  const photoHeight = PASSPORT_HEIGHT;

  let cols = 1;
  let rows = 1;
  let startX = PAGE_MARGIN;
  let startY = PAGE_MARGIN;

  if (options.paperType === "6x4") {
    // 6x4 പേപ്പറിനായി ഫോട്ടോകൾ വൈറ്റ് ബോക്സിനുള്ളിൽ കൃത്യമായി ഫിറ്റ് ചെയ്യാൻ 2 നിരകളായി (Rows) ക്രമീകരിക്കുന്നു
    cols = Math.ceil(options.copies / 2); // കോപ്പികൾക്ക് അനുസരിച്ച് കോളങ്ങൾ ക്രമീകരിക്കും (ഉദാഹരണത്തിന് 8 കോപ്പിക്ക് 4 കോളങ്ങൾ വീതം 2 നിരകൾ)
    rows = 2; // മുകളിലും താഴെയുമായി 2 നിരകൾ

    const totalWidth = cols * photoWidth + (cols - 1) * PHOTO_GAP;
    const totalHeight = rows * photoHeight + (rows - 1) * PHOTO_GAP;

    startX = (canvas.width - totalWidth) / 2; // പേപ്പറിന്റെ കൃത്യം നടുവിലായി സെറ്റ് ചെയ്യാൻ
    startY = (canvas.height - totalHeight) / 2;
  } else {
    // A4 പേപ്പറിനുള്ള പഴയ കോഡ് അതുപോലെ തുടരുന്നു
    cols = 5;
    rows = Math.ceil(options.copies / cols);

    const totalWidth = cols * photoWidth + (cols - 1) * PHOTO_GAP;
    const totalHeight = rows * photoHeight + (rows - 1) * PHOTO_GAP;

    startX = (canvas.width - totalWidth) / 2;
    startY = PAGE_MARGIN + 20;
  }

  return {
    photoWidth,
    photoHeight,
    cols,
    rows,
    startX,
    startY,
    maxCopies: 30,
  };
}

export function drawPassportSheet(
  options: PassportCanvasOptions
) {
  const result = createPassportCanvas(options);

  if (!result) return null;

  const { canvas, ctx } = result;

  const {
    photoWidth,
    photoHeight,
    cols,
    rows,
    startX,
    startY,
    maxCopies,
  } = calculateLayout(canvas, options);

  const copies = Math.min(options.copies, maxCopies);

  ctx.save();

  ctx.filter = `
    brightness(${options.brightness}%)
    contrast(${options.contrast}%)
    saturate(${options.saturation}%)
    hue-rotate(${options.hue}deg)
  `;

  for (let i = 0; i < copies; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = startX + col * (photoWidth + PHOTO_GAP);
    const y = startY + row * (photoHeight + PHOTO_GAP);

    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(x, y, photoWidth, photoHeight);

    ctx.save();

    // ഫോട്ടോയുടെ കൃത്യം നടുത്തേക്ക് മാറ്റി ക്ലിപ്പ് ചെയ്യുക
    ctx.translate(
      x + photoWidth / 2,
      y + photoHeight / 2
    );

    ctx.rotate((options.rotation * Math.PI) / 180);

    const currentScale = options.zoom <= 5 ? options.zoom : options.zoom / 100;
    ctx.scale(currentScale, currentScale);

    ctx.beginPath();
    ctx.rect(
      -photoWidth / 2,
      -photoHeight / 2,
      photoWidth,
      photoHeight
    );

    ctx.clip();

    const imageRatio = options.image.width / options.image.height;
    const frameRatio = photoWidth / photoHeight;

    let drawWidth = photoWidth;
    let drawHeight = photoHeight;

    if (imageRatio > frameRatio) {
      drawWidth = photoHeight * imageRatio;
      drawHeight = photoHeight;
    } else {
      drawWidth = photoWidth;
      drawHeight = photoWidth / imageRatio;
    }

    ctx.drawImage(
      options.image,
      -drawWidth / 2 + options.imagePosition.x,
      -drawHeight / 2 + options.imagePosition.y,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // ഫോട്ടോയുടെ കൃത്യം അതിരുകളിലൂടെ (Edges) തന്നെ കറുത്ത ബോർഡർ വരയ്ക്കുന്നു (വൈറ്റ് ഗ്യാപ്പ് ഉണ്ടാകില്ല)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = options.borderSize > 0 ? options.borderSize * 0.2 : 1; // ബോർഡർ സൈസ് അനുസരിച്ച് കട്ടി വ്യത്യാസപ്പെടും
    ctx.strokeRect(x, y, photoWidth, photoHeight);
  }

  ctx.restore();

  return canvas;
}