'use client';

import { forwardRef } from 'react';

interface EmojiCanvasRendererProps {
  className?: string;
}

export const EmojiCanvasRenderer = forwardRef<HTMLCanvasElement, EmojiCanvasRendererProps>(
  ({ className }, ref) => {
    return (
      <canvas
        ref={ref}
        className={`block max-w-full h-auto bg-white rounded-lg shadow-sm ring-1 ring-gray-200 ${className}`}
      />
    );
  }
);

EmojiCanvasRenderer.displayName = 'EmojiCanvasRenderer';
