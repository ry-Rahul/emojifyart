'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { EmojiCategory } from '@/lib/emojiMap';

interface EmojiControlsProps {
  onGenerate: (category: EmojiCategory, emojiSize: number, options?: { fitToOriginal?: boolean; dither?: boolean; scale?: number }) => void;
  isLoading: boolean;
  previewImage: string | null;
}

const categories: { value: EmojiCategory; label: string }[] = [
  { value: 'smileys', label: 'Smileys' },
  { value: 'hearts', label: 'Hearts' },
  { value: 'animals', label: 'Animals' },
  { value: 'mixed', label: 'Mixed' },
];

export function EmojiControls({ onGenerate, isLoading, previewImage }: EmojiControlsProps) {
  const [selectedCategory, setSelectedCategory] = useState<EmojiCategory>('colored');
  const [emojiSize, setEmojiSize] = useState(4);
  const [fitToOriginal, setFitToOriginal] = useState(true);
  const [dither, setDither] = useState(true);
  const [exportScale, setExportScale] = useState(2);

  const handleGenerate = () => {
    onGenerate(selectedCategory, emojiSize, { fitToOriginal, dither, scale: exportScale });
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Emoji Style
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-lg py-2 px-3 text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={!previewImage || isLoading}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="export-scale" className="block text-sm font-medium text-gray-700 mb-3">
          Export Quality: {exportScale}x (Higher = Sharper zoom)
        </label>
        <input
          id="export-scale"
          type="range"
          min="1"
          max="4"
          step="1"
          value={exportScale}
          onChange={(e) => setExportScale(Number(e.target.value))}
          disabled={!previewImage || isLoading}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Standard (1x)</span>
          <span>Ultra (4x)</span>
        </div>
      </div>

      <div>
        <label htmlFor="emoji-size" className="block text-sm font-medium text-gray-700 mb-3">
          Emoji Size: {emojiSize}px (Smaller = More Detail)
        </label>
        <input
          id="emoji-size"
          type="range"
          min="2"
          max="30"
          value={emojiSize}
          onChange={(e) => setEmojiSize(Number(e.target.value))}
          disabled={!previewImage || isLoading}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Ultra Small (2-5px)</span>
          <span>Large (20-30px)</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={fitToOriginal}
            onChange={(e) => setFitToOriginal(e.target.checked)}
            disabled={!previewImage || isLoading}
          />
          Fit to original image size
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={dither}
            onChange={(e) => setDither(e.target.checked)}
            disabled={!previewImage || isLoading}
          />
          High detail (dithering)
        </label>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!previewImage || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Mosaic'}
      </Button>
    </div>
  );
}
