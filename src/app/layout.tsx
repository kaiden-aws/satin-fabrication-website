import type { Metadata } from 'next'
import { Playfair_Display, Raleway } from 'next/font/google'
import { Providers } from '@/providers/Providers'
import { GrainOverlay } from '@/components/layout/GrainOverlay'
import { SkipLink } from '@/components/layout/SkipLink'
import { Navbar } from '@/components/layout/Navbar'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { SITE_CONFIG } from '@/lib/metadata'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700'],
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline} -- ${SITE_CONFIG.region}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline} -- ${SITE_CONFIG.region}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline} -- ${SITE_CONFIG.region}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`} suppressHydrationWarning>
      <body className="bg-void text-cream antialiased font-body">
        <SkipLink />
        <Providers>
          <Navbar />
          {children}
          <CustomCursor />
        </Providers>
        <GrainOverlay />
      </body>
    </html>
  )
}
