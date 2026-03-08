import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { DonationBadge } from '@/components/DonationBadge'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Emoji Mosaic Generator - Transform Photos into Emoji Art',
  description: 'Create stunning emoji mosaics from your photos. Choose from multiple emoji styles (smileys, hearts, animals, mixed), adjust emoji size, and download your unique digital artwork.',
  keywords: 'emoji mosaic, photo to emoji, emoji art generator, creative tool, digital art',
  generator: 'v0.app',
  openGraph: {
    title: 'Emoji Mosaic Generator',
    description: 'Transform your photos into beautiful emoji mosaics',
    type: 'website',
  },
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
      <body className="font-sans antialiased">
        {children}
        <DonationBadge />
        <Analytics />
      </body>
    </html>
  )
}
