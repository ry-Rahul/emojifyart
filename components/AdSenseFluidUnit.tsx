'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseFluidUnit() {
  const filled = useRef(false);

  useEffect(() => {
    if (filled.current) return;
    filled.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* Ad blocker or unavailable */
    }
  }, []);

  return (
    <div className="overflow-hidden rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-200">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
        data-ad-client="ca-pub-8671097433271995"
        data-ad-slot="7617960121"
      />
    </div>
  );
}
