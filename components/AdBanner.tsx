export function AdBanner({ position }: { position: 'top' | 'middle' | 'bottom' }) {
  return (
    <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 ring-1 ring-gray-300">
      <div className="text-center">
        <p className="text-sm text-gray-600 font-medium">Advertisement</p>
        <p className="text-xs text-gray-500 mt-1">
          {position === 'top' && 'Start creating amazing emoji mosaics today!'}
          {position === 'middle' && 'Premium features available - Unlock more emoji styles!'}
          {position === 'bottom' && 'Share your emoji mosaic on social media!'}
        </p>
      </div>
    </div>
  );
}
