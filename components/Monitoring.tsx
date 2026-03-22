'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

const reportMetric = (name: string, value: number) => {
  const roundedValue = Math.round(value * 100) / 100;
  track('performance_metric', { name, value: roundedValue });
};

export function Monitoring() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      track('frontend_error', {
        type: 'error',
        message: event.message || 'Unknown error',
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason =
        typeof event.reason === 'string'
          ? event.reason
          : event.reason instanceof Error
            ? event.reason.message
            : 'Unhandled promise rejection';

      track('frontend_error', {
        type: 'promise_rejection',
        message: reason,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          reportMetric('LCP', entry.startTime);
        }

        if (entry.entryType === 'event') {
          const eventEntry = entry as PerformanceEventTiming;
          if (eventEntry.duration > 200) {
            reportMetric('INP_like', eventEntry.duration);
          }
        }
      }
    });

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      observer.observe({ type: 'event', buffered: true } as PerformanceObserverInit);
    } catch {
      // Ignore unsupported performance entry types.
    }

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      observer.disconnect();
    };
  }, []);

  return null;
}
