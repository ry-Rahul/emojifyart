'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { EmojiControls } from '@/components/EmojiControls';
import { ResultSection } from '@/components/ResultSection';
import { AdBanner } from '@/components/AdBanner';
import { SEOContent } from '@/components/SEOContent';
import { Footer } from '@/components/Footer';
import { useMosaicGenerator } from '@/hooks/useMosaicGenerator';
import { EmojiCanvasRenderer } from '@/components/EmojiCanvasRenderer';

export default function Home() {
  const { state, canvasRef, handleImageUpload, generateMosaic, downloadMosaic } =
    useMosaicGenerator();

  // Auto-generate mosaic when image is uploaded (with default settings: very small emojis for high precision)
  useEffect(() => {
    if (state.previewImage && !state.mosaicGenerated && !state.isLoading) {
      generateMosaic('colored', 4, { fitToOriginal: true, dither: true, scale: 2 });
    }
  }, [state.previewImage, state.mosaicGenerated, state.isLoading, generateMosaic]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 w-full mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Top Advertisement Banner */}
          <div className="rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-[1px]">
            <div className="rounded-xl bg-white">
              <AdBanner position="top" />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Step 1: Upload Your Image</h2>
            <ImageUploader onImageSelected={handleImageUpload} isLoading={state.isLoading} />
            {state.previewImage && (
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
                <p className="text-sm text-gray-600 mb-3">Preview</p>
                <img
                  src={state.previewImage}
                  alt="Preview"
                  className="max-w-full h-auto rounded mx-auto"
                />
              </div>
            )}
          </div>

          {/* Middle Advertisement Banner */}
          {state.previewImage && (
            <div className="rounded-xl bg-gradient-to-r from-fuchsia-50 via-sky-50 to-amber-50 p-[1px]">
              <div className="rounded-xl bg-white">
                <AdBanner position="middle" />
              </div>
            </div>
          )}

          {/* Emoji Controls Section */}
          {state.previewImage && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Step 2: Customize & Generate</h2>
              <EmojiControls
                onGenerate={generateMosaic}
                isLoading={state.isLoading}
                previewImage={state.previewImage}
              />
            </div>
          )}

          {/* Result Section */}
          {state.mosaicGenerated && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Emoji Mosaic</h2>
              <div className="rounded-xl bg-gradient-to-r from-sky-50 via-emerald-50 to-violet-50 p-[1px]">
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <EmojiCanvasRenderer ref={canvasRef} />
                </div>
              </div>
              <button
                onClick={downloadMosaic}
                disabled={state.isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Download Mosaic
              </button>
            </div>
          )}

          {/* Bottom Advertisement Banner */}
          {state.mosaicGenerated && <AdBanner position="bottom" />}

          {/* Error Display */}
          {state.error && (
            <div className="rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          )}

          {/* SEO Content */}
          <SEOContent />

          {/* Donate Section */}
          <div className="rounded-xl bg-gradient-to-r from-pink-50 via-indigo-50 to-teal-50 p-[1px]">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Support the Project</h2>
            <p className="text-sm text-gray-600 mb-4">
              Scan the QR to donate and help keep this tool improving.
            </p>
            <img
              src="/qr.jpeg"
              alt="Donation QR code"
              className="mx-auto w-full max-w-xs h-auto rounded-lg ring-1 ring-gray-200"
            />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
