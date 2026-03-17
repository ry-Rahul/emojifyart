import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function Header() {
  return (
    <header className="relative w-full border-b border-gray-200 bg-white">
      <Dialog>
        <DialogTrigger className="hidden sm:inline-flex absolute top-4 right-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:from-fuchsia-500 hover:to-violet-500">
          Donate
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Support This Tool</DialogTitle>
            <DialogDescription>
              Your donation helps keep this project improving for everyone. Thank you!
            </DialogDescription>
          </DialogHeader>
          <img
            src="/QR.jpeg"
            alt="Donation QR code"
            className="mx-auto w-56 h-auto rounded-lg ring-1 ring-gray-200"
          />
        </DialogContent>
      </Dialog>
      <div className="mx-auto max-w-2xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-violet-600 to-sky-600">
          Emoji Mosaic Generator
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Transform your photos into beautiful emoji mosaics
        </p>
      </div>
    </header>
  );
}
