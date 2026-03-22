import { coloredEmojiPalette } from './emojiMap';

export interface CanvasImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface ImageDataPayload {
  imageData: CanvasImageData;
  width: number;
  height: number;
}

export interface MosaicOptions {
  fitToOriginal?: boolean;
  dither?: boolean;
  scale?: number;
}

export interface MosaicCell {
  emoji: string;
  x: number;
  y: number;
}

export interface MosaicRenderPayload {
  width: number;
  height: number;
  fontPx: number;
  cellCanvasW: number;
  cellCanvasH: number;
  cells: MosaicCell[];
}

const getColorDistance = (
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number => {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const getBrightness = (r: number, g: number, b: number): number => {
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

const findClosestEmojiColor = (r: number, g: number, b: number): string => {
  const targetBrightness = getBrightness(r, g, b);
  let closestEmoji = coloredEmojiPalette[0].emoji;
  let minDistance = Infinity;

  for (const emojiColor of coloredEmojiPalette) {
    const distance = getColorDistance(r, g, b, emojiColor.r, emojiColor.g, emojiColor.b);
    const emojiBrightness = getBrightness(emojiColor.r, emojiColor.g, emojiColor.b);
    const brightnessRatio = Math.abs(targetBrightness - emojiBrightness) / 255;
    const adjustedDistance = distance + brightnessRatio * 10;

    if (adjustedDistance < minDistance) {
      minDistance = adjustedDistance;
      closestEmoji = emojiColor.emoji;
    }
  }

  return closestEmoji;
};

export const buildMosaicPayload = (
  imageData: ImageDataPayload,
  emojiSize: number,
  options?: MosaicOptions
): MosaicRenderPayload => {
  const { imageData: imgData, width: imgWidth, height: imgHeight } = imageData;
  const data = imgData.data;

  const fitToOriginal = options?.fitToOriginal ?? true;
  const enableDither = options?.dither ?? true;
  const scale = Math.max(1, options?.scale ?? 1);

  const gridCols = Math.max(1, Math.floor(imgWidth / Math.max(2, emojiSize)));
  const gridRows = Math.max(1, Math.floor(imgHeight / Math.max(2, emojiSize)));
  const srcBlockW = Math.max(1, Math.floor(imgWidth / gridCols));
  const srcBlockH = Math.max(1, Math.floor(imgHeight / gridRows));

  const width = fitToOriginal
    ? Math.round(imgWidth * scale)
    : Math.round(gridCols * emojiSize * scale);
  const height = fitToOriginal
    ? Math.round(imgHeight * scale)
    : Math.round(gridRows * emojiSize * scale);

  const cellCanvasW = width / gridCols;
  const cellCanvasH = height / gridRows;
  const fontPx = Math.max(1, Math.floor(Math.min(cellCanvasW, cellCanvasH)));

  const errR = enableDither ? new Float32Array(gridCols * gridRows) : null;
  const errG = enableDither ? new Float32Array(gridCols * gridRows) : null;
  const errB = enableDither ? new Float32Array(gridCols * gridRows) : null;
  const cells: MosaicCell[] = [];

  for (let by = 0; by < gridRows; by++) {
    for (let bx = 0; bx < gridCols; bx++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      const startX = bx * srcBlockW;
      const startY = by * srcBlockH;
      const endX = Math.min(startX + srcBlockW, imgWidth);
      const endY = Math.min(startY + srcBlockH, imgHeight);

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const idx = (y * imgWidth + x) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
          count++;
        }
      }

      if (count === 0 || a / count <= 10) {
        continue;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      if (enableDither && errR && errG && errB) {
        const i = by * gridCols + bx;
        r = Math.max(0, Math.min(255, r + errR[i]));
        g = Math.max(0, Math.min(255, g + errG[i]));
        b = Math.max(0, Math.min(255, b + errB[i]));
      }

      const emoji = findClosestEmojiColor(r, g, b);

      if (enableDither && errR && errG && errB) {
        const chosen = coloredEmojiPalette.find((entry) => entry.emoji === emoji);
        if (chosen) {
          const diffR = r - chosen.r;
          const diffG = g - chosen.g;
          const diffB = b - chosen.b;

          const distribute = (x: number, y: number, factor: number) => {
            if (x >= 0 && x < gridCols && y >= 0 && y < gridRows) {
              const j = y * gridCols + x;
              errR[j] += diffR * factor;
              errG[j] += diffG * factor;
              errB[j] += diffB * factor;
            }
          };

          distribute(bx + 1, by, 7 / 16);
          distribute(bx - 1, by + 1, 3 / 16);
          distribute(bx, by + 1, 5 / 16);
          distribute(bx + 1, by + 1, 1 / 16);
        }
      }

      cells.push({
        emoji,
        x: (bx + 0.5) * cellCanvasW,
        y: (by + 0.5) * cellCanvasH,
      });
    }
  }

  return {
    width,
    height,
    fontPx,
    cellCanvasW,
    cellCanvasH,
    cells,
  };
};

