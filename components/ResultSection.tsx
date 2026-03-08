'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { EmojiCanvasRenderer } from './EmojiCanvasRenderer';

interface ResultSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mosaicGenerated: boolean;
  onDownload: () => void;
  isLoading: boolean;
}

export function ResultSection({
  canvasRef,
  mosaicGenerated,
  onDownload,
  isLoading,
}: ResultSectionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        {mosaicGenerated && (
          <div className="space-y-4">
            <EmojiCanvasRenderer ref={canvasRef} />
            <Button
              onClick={onDownload}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Mosaic
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
