'use client';

import { useState, useRef, useCallback } from 'react';
import {
  loadImageFromFile,
  extractImageData,
  generateEmojiMosaic,
  downloadCanvasAsImage,
  type ImageData,
} from '@/lib/canvasProcessor';
import { getCategoryEmojis, type EmojiCategory } from '@/lib/emojiMap';

export interface MosaicGeneratorState {
  isLoading: boolean;
  isDownloading: boolean;
  error: string | null;
  previewImage: string | null;
  mosaicGenerated: boolean;
}

export const useMosaicGenerator = () => {
  const [state, setState] = useState<MosaicGeneratorState>({
    isLoading: false,
    isDownloading: false,
    error: null,
    previewImage: null,
    mosaicGenerated: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  // Create internal canvas for mosaic generation
  const getOrCreateCanvas = () => {
    if (!internalCanvasRef.current) {
      internalCanvasRef.current = document.createElement('canvas');
    }
    return internalCanvasRef.current;
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const img = await loadImageFromFile(file);
      const imgData = extractImageData(img, img.naturalWidth);
      imageDataRef.current = imgData;

      // Create preview
      const canvas = document.createElement('canvas');
      canvas.width = imgData.width;
      canvas.height = imgData.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, imgData.width, imgData.height);
        const preview = canvas.toDataURL('image/png');
        setState((prev) => ({
          ...prev,
          previewImage: preview,
          mosaicGenerated: false,
          isLoading: false,
          error: null,
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to process image',
        isLoading: false,
      }));
    }
  }, []);

  const generateMosaic = useCallback(
    (category: EmojiCategory, emojiSize: number, options?: { fitToOriginal?: boolean; dither?: boolean; scale?: number }) => {
      if (!imageDataRef.current) {
        setState((prev) => ({
          ...prev,
          error: 'Please upload an image first',
        }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Use requestAnimationFrame to ensure proper rendering
      requestAnimationFrame(() => {
        try {
          const canvas = getOrCreateCanvas();
          const emojis = getCategoryEmojis(category);
          
          generateEmojiMosaic(canvas, imageDataRef.current!, emojis, emojiSize, {
            fitToOriginal: options?.fitToOriginal ?? true,
            dither: options?.dither ?? true,
            scale: options?.scale ?? 1,
          });
          
          // Copy to ref canvas if it exists
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              canvasRef.current.width = canvas.width;
              canvasRef.current.height = canvas.height;
              ctx.drawImage(canvas, 0, 0);
            }
          }
          
          setState((prev) => ({
            ...prev,
            mosaicGenerated: true,
            isLoading: false,
            error: null,
          }));
        } catch (err) {
          console.error('[v0] Mosaic generation error:', err);
          setState((prev) => ({
            ...prev,
            error: err instanceof Error ? err.message : 'Failed to generate mosaic',
            isLoading: false,
          }));
        }
      });
    },
    []
  );

  const downloadMosaic = useCallback(() => {
    const canvas = internalCanvasRef.current || canvasRef.current;
    if (!canvas) {
      setState((prev) => ({
        ...prev,
        error: 'No mosaic to download',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isDownloading: true, error: null }));

    try {
      downloadCanvasAsImage(canvas, 'emoji-mosaic.png');
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to download mosaic',
        isDownloading: false,
      }));
      return;
    }

    // Reset download loader after a short delay so the user can see it
    setTimeout(() => {
      setState((prev) => ({ ...prev, isDownloading: false }));
    }, 500);
  }, []);

  return {
    state,
    canvasRef,
    handleImageUpload,
    generateMosaic,
    downloadMosaic,
  };
};
