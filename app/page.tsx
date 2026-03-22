'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { EmojiCanvasRenderer } from '@/components/EmojiCanvasRenderer';
import { EmojiControls } from '@/components/EmojiControls';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { SEOContent } from '@/components/SEOContent';
import { Spinner } from '@/components/ui/spinner';
import { useMosaicGenerator } from '@/hooks/useMosaicGenerator';

export default function Home() {
  const { state, canvasRef, handleImageUpload, generateMosaic, downloadMosaic } =
    useMosaicGenerator();
  const previousGeneratedRef = useRef(false);
  const previousDownloadingRef = useRef(false);
  const previousErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.mosaicGenerated && !previousGeneratedRef.current) {
      toast.success('Image created', {
        description: 'Your emoji mosaic is ready to preview and download.',
      });
    }

    previousGeneratedRef.current = state.mosaicGenerated;
  }, [state.mosaicGenerated]);

  useEffect(() => {
    if (state.error && state.error !== previousErrorRef.current) {
      toast.error('Something went wrong', {
        description: state.error,
      });
    }

    previousErrorRef.current = state.error;
  }, [state.error]);

  useEffect(() => {
    if (previousDownloadingRef.current && !state.isDownloading && !state.error) {
      toast.success('Download started', {
        description: 'Your emoji mosaic is being downloaded.',
      });
    }

    previousDownloadingRef.current = state.isDownloading;
  }, [state.isDownloading, state.error]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 w-full mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'Emoji Mosaic Generator',
                url: 'https://example.com/',
                applicationCategory: 'Multimedia',
                operatingSystem: 'Web',
                description:
                  'Create stunning emoji mosaics from your photos. Change emoji to image with high-quality export.',
                keywords: [
                  'emoji mosaic',
                  'emojiArt',
                  'change emoji to image',
                  'emoji to image converter',
                  'emoji art generator',
                ],
              }),
            }}
          />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Step 1: Upload Your Image</h2>
            <ImageUploader
              onImageSelected={handleImageUpload}
              isLoading={state.isLoading}
              loadingStage={state.loadingStage}
              processedWidth={state.processedWidth}
              processedHeight={state.processedHeight}
              wasResized={state.wasResized}
            />
            {state.previewImage ? (
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
                <p className="text-sm text-gray-600 mb-3">Preview</p>
                <img
                  src={state.previewImage}
                  alt="Preview"
                  className="max-w-full h-auto rounded mx-auto"
                />
              </div>
            ) : null}
          </div>

          {state.previewImage ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Step 2: Customize & Generate</h2>
              <EmojiControls
                onGenerate={generateMosaic}
                isLoading={state.isLoading}
                previewImage={state.previewImage}
                loadingStage={state.loadingStage}
                maxExportScale={state.maxExportScale}
              />
            </div>
          ) : null}

          {state.mosaicGenerated || state.loadingStage === 'generating' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Emoji Mosaic</h2>
              <div className="rounded-xl bg-gradient-to-r from-sky-50 via-emerald-50 to-violet-50 p-[1px]">
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                  <div className="relative min-h-[320px]">
                    <EmojiCanvasRenderer
                      ref={canvasRef}
                      className={!state.mosaicGenerated ? 'min-h-[320px] w-full' : ''}
                    />
                    {state.loadingStage === 'generating' ? (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/78">
                        <div className="flex flex-col items-center gap-3 px-6 text-center">
                          <Spinner className="h-8 w-8 text-sky-600" />
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-gray-900">
                              Generating your emoji mosaic...
                            </p>
                            <p className="text-sm text-gray-600">
                              Heavy image analysis runs in the background while the canvas stays ready.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {state.mosaicGenerated ? (
                <button
                  onClick={downloadMosaic}
                  disabled={state.isLoading || state.isDownloading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {state.isDownloading ? (
                    <span className="text-sm font-medium">Preparing download...</span>
                  ) : (
                    <span>Download Mosaic</span>
                  )}
                </button>
              ) : null}
            </div>
          ) : null}

          {state.error ? (
            <div className="rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          ) : null}

          <section
            id="about"
            className="rounded-xl bg-gradient-to-r from-amber-50 via-white to-sky-50 p-[1px]"
          >
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">About</h2>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                Emoji Mosaic Generator turns photos into emoji-based artwork directly in your
                browser. It is built for fast experimentation, adjustable export quality, and
                simple downloads without requiring any app install or account.
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                The goal of this website is to make creative image transformation easy for
                students, creators, and anyone who wants to turn ordinary pictures into something
                more playful and shareable.
              </p>
            </div>
          </section>

          <SEOContent />

          <div className="rounded-xl bg-gradient-to-r from-pink-50 via-indigo-50 to-teal-50 p-[1px]">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Support the Project</h2>
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR to donate and help keep this tool improving.
              </p>
              <img
                src="/QR.jpeg"
                alt="Donation QR code"
                className="mx-auto w-full max-w-xs h-auto rounded-lg ring-1 ring-gray-200"
              />
            </div>
          </div>

          <section
            id="contact"
            className="rounded-xl bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-[1px]"
          >
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Contact</h2>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                For feedback, collaborations, feature requests, or bugs, reach out on LinkedIn.
              </p>
              <a
                href="https://www.linkedin.com/in/rahul-yadav-482156223/"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center rounded-lg bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#084f99]"
              >
                Connect on LinkedIn
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
