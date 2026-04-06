import './globals.css'

import { Analytics } from '@vercel/analytics/next'
import { DonationBadge } from '@/components/DonationBadge'
import type { Metadata } from 'next'
import { Monitoring } from '@/components/Monitoring'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Emoji Mosaic Generator - Transform Photos into Emoji Art',
  description: 'Create stunning emoji mosaics from your photos. Choose from multiple emoji styles (smileys, hearts, animals, mixed), adjust emoji size, and download your unique digital artwork.',
  keywords: [
    'emoji mosaic',
    'photo to emoji',
    'emoji art generator',
    'creative tool',
    'digital art',
    'emojiArt',
    'change emoji to image',
    'emoji to image converter',
    'emoji image generator',
    'mosaic art tool',
  ],
  generator: 'v0.app',
  openGraph: {
    title: 'Emoji Mosaic Generator',
    description: 'Transform your photos into beautiful emoji mosaics',
    type: 'website',
    images: ['/placeholder.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Mosaic Generator',
    description: 'Transform your photos into beautiful emoji mosaics',
    images: ['/placeholder.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: '/',
  },
  metadataBase: new URL('https://emojiart.in'),
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8671097433271995"
          crossOrigin="anonymous"
        />
      </head> */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Monitoring />
        <DonationBadge />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
