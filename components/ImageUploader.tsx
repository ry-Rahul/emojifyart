'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
  loadingStage?: 'uploading' | 'generating' | null;
  processedWidth?: number | null;
  processedHeight?: number | null;
  wasResized?: boolean;
}

export function ImageUploader({
  onImageSelected,
  isLoading,
  loadingStage,
  processedWidth,
  processedHeight,
  wasResized,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageSelected(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={isLoading}
      />

      {loadingStage === 'uploading' ? (
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8 text-blue-600" />
          <p className="text-sm font-medium text-gray-900">Uploading and preparing your image...</p>
          <p className="text-xs text-gray-500">Large images are resized for smoother generation.</p>
        </div>
      ) : (
        <>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          {processedWidth && processedHeight ? (
            <p className="mt-2 text-xs text-gray-500">
              Working size: {processedWidth} x {processedHeight}
              {wasResized ? ' (optimized from your original image)' : ''}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
