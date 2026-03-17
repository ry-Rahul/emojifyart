'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { EmojiCanvasRenderer } from './EmojiCanvasRenderer';

interface ResultSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mosaicGenerated: boolean;
  onDownload: () => void;
  isLoading: boolean;
  isDownloading?: boolean;
}

export function ResultSection({
  canvasRef,
  mosaicGenerated,
  onDownload,
  isLoading,
  isDownloading,
}: ResultSectionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        {mosaicGenerated && (
          <div className="space-y-4">
            <div className="relative">
              <EmojiCanvasRenderer ref={canvasRef} />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
                  <span className="text-sm font-medium text-gray-700">Generating mosaic...</span>
                </div>
              )}
            </div>
            <Button
              onClick={onDownload}
              disabled={isLoading || isDownloading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Preparing download...' : 'Download Mosaic'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
