'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseSidebarUnit({ className }: { className?: string }) {
  const filled = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const tryPush = () => {
      if (filled.current) return;
      if (el.offsetParent === null || el.getBoundingClientRect().width <= 0) return;
      filled.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* Ad blocker or unavailable */
      }
    };

    tryPush();
    const ro = new ResizeObserver(() => tryPush());
    ro.observe(el);
    const raf = requestAnimationFrame(() => tryPush());
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-lg bg-white p-2 shadow-sm ring-1 ring-gray-200 ${className ?? ''}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '250px', minWidth: '160px' }}
        data-ad-client="ca-pub-8671097433271995"
        data-ad-slot="7547694432"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
