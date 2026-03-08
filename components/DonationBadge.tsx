'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function DonationBadge() {
  return (
    <>
      <div className="hidden sm:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3">
        <a
          href="/qr.jpeg"
          aria-label="Donate via QR"
          className="block"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/qr.jpeg"
            alt="Donation QR code"
            className="w-40 h-40 rounded-xl ring-1 ring-gray-300 shadow-md bg-white"
          />
        </a>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-800 bg-white/90 px-3 py-1 rounded-full ring-1 ring-gray-300 inline-block">
            Thank you for supporting this tool!
          </p>
          <p className="mt-1 text-xs text-gray-600">Scan the QR to donate 💙</p>
        </div>
      </div>

      <Dialog>
        <DialogTrigger className="sm:hidden fixed bottom-4 right-4 z-50 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2 text-white text-sm font-medium shadow-sm">
          Donate
        </DialogTrigger>
        <DialogContent className="sm:hidden">
          <DialogHeader>
            <DialogTitle>Support This Tool</DialogTitle>
            <DialogDescription>
              Your donation helps keep this project improving for everyone. Thank you!
            </DialogDescription>
          </DialogHeader>
          <img
            src="/qr.jpeg"
            alt="Donation QR code"
            className="mx-auto w-[75vw] max-w-xs h-auto rounded-lg ring-1 ring-gray-200"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
