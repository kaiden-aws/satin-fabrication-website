import type { Metadata } from 'next'
import { Playfair_Display, Raleway } from 'next/font/google'
import { Providers } from '@/providers/Providers'
import { GrainOverlay } from '@/components/layout/GrainOverlay'
import { SkipLink } from '@/components/layout/SkipLink'
import { Navbar } from '@/components/layout/Navbar'
import { CustomCursor } from '@/components/layout/CustomCursor'
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
  title: 'Satin Fabrication | Custom Architectural Metalwork',
  description: "Premium custom metal fabrication for Southern Ontario's finest homes.",
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
