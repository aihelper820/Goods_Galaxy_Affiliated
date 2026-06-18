import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-gga',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Goods Galaxy Affiliated | Handpicked Amazon Products',
  description: 'Discover curated Amazon products hand-picked with care for discerning readers. Books, electronics, home goods, fitness gear and more.',
  keywords: ['amazon', 'products', 'curator', 'reviews', 'affiliate', 'handpicked'],
  robots: 'index, follow',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Goods Galaxy Affiliated',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Goods Galaxy Affiliated | Handpicked Amazon Products',
    description: 'Discover curated Amazon products hand-picked with care for discerning readers.',
    url: 'https://goodsgalaxyaffiliated.com',
    siteName: 'Goods Galaxy Affiliated',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goods Galaxy Affiliated',
    description: 'Handpicked Amazon products for you'
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#e60023',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full`} data-scroll-behavior="smooth">
      <body className="h-full antialiased bg-surface text-on-surface font-body">
        {children}
      </body>
    </html>
  )
}
