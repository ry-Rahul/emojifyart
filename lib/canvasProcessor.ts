/**
 * Canvas-based image processing for emoji mosaic generation
 */

export interface ImageData {
  imageData: CanvasImageData;
  width: number;
  height: number;
}

export interface CanvasImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/**
 * Load an image from a File and return canvas-compatible image data
 */
export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Set a timeout to handle loading issues
      const timeout = setTimeout(() => {
        reject(new Error('Image loading timed out'));
      }, 10000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Extract image data from an HTMLImageElement
 * Resizes to high resolution for precise mosaic generation with small emojis
 */
export const extractImageData = (img: HTMLImageElement, maxWidth: number = 400): ImageData => {
  // Calculate dimensions maintaining aspect ratio
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (width > maxWidth) {
    const scale = maxWidth / width;
    width = maxWidth;
    height = Math.round(height * scale);
  }

  // Create canvas and extract pixel data
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  return {
    imageData: {
      data: imageData.data,
      width,
      height,
    },
    width,
    height,
  };
};

import { coloredEmojiPalette } from './emojiMap';

/**
 * Calculate Euclidean distance between two RGB colors
 */
const getColorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number => {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

/**
 * Calculate brightness of a color (0-255)
 */
const getBrightness = (r: number, g: number, b: number): number => {
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

/**
 * Find the closest emoji color from the palette with brightness balancing
 */
const findClosestEmojiColor = (r: number, g: number, b: number): string => {
  const targetBrightness = getBrightness(r, g, b);
  let closestEmoji = coloredEmojiPalette[0].emoji;
  let minDistance = Infinity;

  for (const emojiColor of coloredEmojiPalette) {
    const distance = getColorDistance(r, g, b, emojiColor.r, emojiColor.g, emojiColor.b);
    
    // Slightly penalize extreme brightness/darkness to avoid over-using black/white
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

/**
 * Generate emoji mosaic using block-based averaging
 * This approach divides the image into blocks, averages colors per block,
 * and selects emojis based on the average color
 */
export interface MosaicOptions {
  fitToOriginal?: boolean;
  dither?: boolean;
  scale?: number;
}

export const generateEmojiMosaic = (
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  emojis: string[],
  emojiSize: number,
  options?: MosaicOptions,
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const { imageData: imgData, width: imgWidth, height: imgHeight } = imageData;
  const data = imgData.data;

  const fitToOriginal = options?.fitToOriginal ?? true;
  const enableDither = options?.dither ?? true;
  const scale = Math.max(1, options?.scale ?? 1);

  let gridCols = Math.max(1, Math.floor(imgWidth / Math.max(2, emojiSize)));
  let gridRows = Math.max(1, Math.floor(imgHeight / Math.max(2, emojiSize)));

  const srcBlockW = Math.max(1, Math.floor(imgWidth / gridCols));
  const srcBlockH = Math.max(1, Math.floor(imgHeight / gridRows));

  if (fitToOriginal) {
    canvas.width = Math.round(imgWidth * scale);
    canvas.height = Math.round(imgHeight * scale);
  } else {
    canvas.width = Math.round(gridCols * emojiSize * scale);
    canvas.height = Math.round(gridRows * emojiSize * scale);
  }

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const cellCanvasW = canvas.width / gridCols;
  const cellCanvasH = canvas.height / gridRows;
  const fontPx = Math.floor(Math.min(cellCanvasW, cellCanvasH));

  ctx.font = `${fontPx}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const errR = enableDither ? new Float32Array(gridCols * gridRows) : null;
  const errG = enableDither ? new Float32Array(gridCols * gridRows) : null;
  const errB = enableDither ? new Float32Array(gridCols * gridRows) : null;

  for (let by = 0; by < gridRows; by++) {
    for (let bx = 0; bx < gridCols; bx++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;

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

      if (count > 0 && a / count > 10) {
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        if (enableDither && errR && errG && errB) {
          const i = by * gridCols + bx;
          r = Math.max(0, Math.min(255, r + errR[i]));
          g = Math.max(0, Math.min(255, g + errG[i]));
          b = Math.max(0, Math.min(255, b + errB[i]));
        }

        // Find the emoji with the closest color
        const emoji = findClosestEmojiColor(r, g, b);

        if (enableDither && errR && errG && errB) {
          const chosen = coloredEmojiPalette.find((e) => e.emoji === emoji)!;
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

        ctx.fillText(emoji, (bx + 0.5) * cellCanvasW, (by + 0.5) * cellCanvasH);
      }
    }
  }

  // Add watermark
  try {
    const watermarkText = 'emojiart.in';
    // Keep watermark size consistent relative to final image height,
    // not tied to emoji size.
    const baseWatermarkSize = Math.max(14, Math.floor(canvas.height * 0.03));
    const padding = Math.max(12, Math.floor(baseWatermarkSize * 0.6));

    ctx.save();
    ctx.font = `${baseWatermarkSize}px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    // Shadow for better readability
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(watermarkText, canvas.width - padding + 1, canvas.height - padding + 1);

    // Main text (darker, more visible)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding);

    ctx.restore();
  } catch {
    // Watermark should never break mosaic generation
  }
};

/**
 * Download canvas as PNG
 */
export const downloadCanvasAsImage = (canvas: HTMLCanvasElement, filename: string = 'emoji-mosaic.png'): void => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  link.click();
};
