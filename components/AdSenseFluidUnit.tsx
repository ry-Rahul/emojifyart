'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Top fluid unit: keep the wrapper flexible so the creative can choose its own height. */
const MIN_WIDTH = 120;
const IFRAME_MIN_W = 48;
const IFRAME_MIN_H = 48;
const POLL_MS = 200;
const STOP_AFTER_MS = 30000;

export function AdSenseFluidUnit() {
  const pushed = useRef(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const tryPush = () => {
      if (pushed.current) return;
      const { width } = el.getBoundingClientRect();
      if (width < MIN_WIDTH) return;
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* Ad blocker or unavailable */
      }
    };

    const tick = () => requestAnimationFrame(tryPush);
    const ro = new ResizeObserver(tick);
    ro.observe(el);
    tick();
    requestAnimationFrame(tick);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) return;

    const detectFilled = () => {
      const iframe = ins.querySelector('iframe');
      if (!iframe) return false;
      const r = iframe.getBoundingClientRect();
      if (r.width >= IFRAME_MIN_W && r.height >= IFRAME_MIN_H) {
        setFilled(true);
        return true;
      }
      return false;
    };

    const mo = new MutationObserver(() => detectFilled());
    mo.observe(ins, { childList: true, subtree: true });

    const roIns = new ResizeObserver(() => detectFilled());
    roIns.observe(ins);

    const poll = window.setInterval(detectFilled, POLL_MS);

    const stopTimer = window.setTimeout(() => {
      window.clearInterval(poll);
      mo.disconnect();
      roIns.disconnect();
    }, STOP_AFTER_MS);

    detectFilled();

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(stopTimer);
      mo.disconnect();
      roIns.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full min-w-0 overflow-hidden" aria-hidden={!filled}>
      <div ref={measureRef} className="w-full min-w-0">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
          data-ad-client="ca-pub-8671097433271995"
          data-ad-slot="7617960121"
        />
      </div>
    </div>
  );
}
