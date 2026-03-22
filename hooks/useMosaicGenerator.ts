'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { downloadCanvasAsImage } from '@/lib/canvasProcessor';
import { type ExtractedImageData, extractImageData, getRecommendedMaxScale, loadImageFromFile } from '@/lib/imageProcessing';
import type { EmojiCategory } from '@/lib/emojiMap';
import { buildMosaicPayload, type MosaicOptions, type MosaicRenderPayload } from '@/lib/mosaicCore';

export interface MosaicGeneratorState {
  isLoading: boolean;
  isDownloading: boolean;
  error: string | null;
  previewImage: string | null;
  mosaicGenerated: boolean;
  loadingStage: 'uploading' | 'generating' | null;
  maxExportScale: number;
  processedWidth: number | null;
  processedHeight: number | null;
  wasResized: boolean;
}

const WORKER_PATH = new URL('../lib/mosaic.worker.ts', import.meta.url);

export const useMosaicGenerator = () => {
  const [state, setState] = useState<MosaicGeneratorState>({
    isLoading: false,
    isDownloading: false,
    error: null,
    previewImage: null,
    mosaicGenerated: false,
    loadingStage: null,
    maxExportScale: 4,
    processedWidth: null,
    processedHeight: null,
    wasResized: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageDataRef = useRef<ExtractedImageData | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const getOrCreateCanvas = () => {
    if (!internalCanvasRef.current) {
      internalCanvasRef.current = document.createElement('canvas');
    }

    return internalCanvasRef.current;
  };

  const getWorker = () => {
    if (!workerRef.current) {
      workerRef.current = new Worker(WORKER_PATH, { type: 'module' });
    }

    return workerRef.current;
  };

  const renderMosaic = useCallback((payload: MosaicRenderPayload) => {
    const canvas = getOrCreateCanvas();
    canvas.width = payload.width;
    canvas.height = payload.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${payload.fontPx}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const cell of payload.cells) {
      ctx.fillText(cell.emoji, cell.x, cell.y);
    }

    try {
      const watermarkText = 'emojiart.in';
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#111827';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.font = `${Math.max(12, Math.floor(payload.fontPx * 0.35))}px sans-serif`;
      ctx.fillText(watermarkText, canvas.width - 12, canvas.height - 12);
      ctx.restore();
    } catch {
      // Ignore watermark rendering issues.
    }

    if (canvasRef.current) {
      const visibleCanvas = canvasRef.current;
      visibleCanvas.width = canvas.width;
      visibleCanvas.height = canvas.height;
      const visibleCtx = visibleCanvas.getContext('2d');
      if (!visibleCtx) {
        throw new Error('Could not get canvas context');
      }
      visibleCtx.drawImage(canvas, 0, 0);
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      mosaicGenerated: false,
      loadingStage: 'uploading',
    }));

    try {
      const img = await loadImageFromFile(file);
      const imgData = extractImageData(img);
      imageDataRef.current = imgData;

      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = imgData.width;
      previewCanvas.height = imgData.height;
      const previewCtx = previewCanvas.getContext('2d');
      if (!previewCtx) {
        throw new Error('Could not get canvas context');
      }

      previewCtx.drawImage(img, 0, 0, imgData.width, imgData.height);
      const preview = previewCanvas.toDataURL('image/png');
      const maxExportScale = getRecommendedMaxScale(imgData.width, imgData.height);

      setState((prev) => ({
        ...prev,
        previewImage: preview,
        mosaicGenerated: false,
        isLoading: false,
        error: null,
        loadingStage: null,
        maxExportScale,
        processedWidth: imgData.width,
        processedHeight: imgData.height,
        wasResized:
          imgData.width !== imgData.originalWidth || imgData.height !== imgData.originalHeight,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process image',
        isLoading: false,
        loadingStage: null,
      }));
    }
  }, []);

  const generateMosaic = useCallback(
    async (
      _category: EmojiCategory,
      emojiSize: number,
      options?: MosaicOptions
    ) => {
      if (!imageDataRef.current) {
        setState((prev) => ({
          ...prev,
          error: 'Please upload an image first',
        }));
        return;
      }

      const safeScale = Math.min(
        Math.max(1, options?.scale ?? 1),
        getRecommendedMaxScale(imageDataRef.current.width, imageDataRef.current.height)
      );

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        loadingStage: 'generating',
      }));

      try {
        const workerResult = await new Promise<MosaicRenderPayload>((resolve, reject) => {
          let worker: Worker;

          try {
            worker = getWorker();
          } catch {
            reject(new Error('Worker unavailable'));
            return;
          }

          worker.onmessage = (
            event: MessageEvent<{ ok: boolean; result?: MosaicRenderPayload; error?: string }>
          ) => {
            if (event.data.ok && event.data.result) {
              resolve(event.data.result);
              return;
            }

            reject(new Error(event.data.error ?? 'Failed to generate mosaic'));
          };

          worker.onerror = () => {
            workerRef.current?.terminate();
            workerRef.current = null;
            reject(new Error('Worker failed while generating mosaic'));
          };

          worker.postMessage({
            imageData: imageDataRef.current,
            emojiSize,
            options: {
              ...options,
              scale: safeScale,
            },
          });
        }).catch(async () => {
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => resolve());
          });

          return buildMosaicPayload(imageDataRef.current!, emojiSize, {
            ...options,
            scale: safeScale,
          });
        });

        renderMosaic(workerResult);
        setState((prev) => ({
          ...prev,
          mosaicGenerated: true,
          isLoading: false,
          error: null,
          loadingStage: null,
          maxExportScale: getRecommendedMaxScale(
            imageDataRef.current?.width ?? prev.processedWidth ?? 0,
            imageDataRef.current?.height ?? prev.processedHeight ?? 0
          ),
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to generate mosaic',
          isLoading: false,
          loadingStage: null,
        }));
      }
    },
    [renderMosaic]
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
      window.setTimeout(() => {
        setState((prev) => ({ ...prev, isDownloading: false }));
      }, 500);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to download mosaic',
        isDownloading: false,
      }));
    }
  }, []);

  return {
    state,
    canvasRef,
    handleImageUpload,
    generateMosaic,
    downloadMosaic,
  };
};
