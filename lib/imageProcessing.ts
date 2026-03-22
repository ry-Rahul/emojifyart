export interface ExtractedImageData {
  imageData: {
    data: Uint8ClampedArray;
    width: number;
    height: number;
  };
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export const MAX_UPLOAD_DIMENSION = 1600;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const getRecommendedMaxScale = (width: number, height: number): number => {
  return 10;
};

export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file'));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      reject(new Error('Image is too large. Please upload a file smaller than 10MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

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

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const extractImageData = (
  img: HTMLImageElement,
  maxDimension: number = MAX_UPLOAD_DIMENSION
): ExtractedImageData => {
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const originalWidth = width;
  const originalHeight = height;

  if (width > maxDimension || height > maxDimension) {
    const scale = Math.min(maxDimension / width, maxDimension / height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

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
    originalWidth,
    originalHeight,
  };
};
