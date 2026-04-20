import Script from 'next/script'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8671097433271995"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
    </>
  )
}
