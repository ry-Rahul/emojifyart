'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

export function ImageUploader({ onImageSelected, isLoading }: ImageUploaderProps) {
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

      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm font-medium text-gray-900">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
    </div>
  );
}
