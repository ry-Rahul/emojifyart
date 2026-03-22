/// <reference lib="webworker" />

import { buildMosaicPayload, type ImageDataPayload, type MosaicOptions } from './mosaicCore';

type WorkerRequest = {
  imageData: ImageDataPayload;
  emojiSize: number;
  options?: MosaicOptions;
};

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  try {
    const result = buildMosaicPayload(
      event.data.imageData,
      event.data.emojiSize,
      event.data.options
    );
    self.postMessage({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate mosaic';
    self.postMessage({ ok: false, error: message });
  }
};

