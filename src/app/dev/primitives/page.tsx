'use client'

import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { ParallaxWrapper } from '@/components/ui/ParallaxWrapper'
import { MasonryGrid, MasonryItem } from '@/components/ui/MasonryGrid'

const revealItems = [
  { label: 'Reveal Item 1', delay: 0 },
  { label: 'Reveal Item 2', delay: 0.1 },
  { label: 'Reveal Item 3', delay: 0.2 },
  { label: 'Reveal Item 4', delay: 0.3 },
  { label: 'Reveal Item 5', delay: 0.4 },
  { label: 'Reveal Item 6', delay: 0.5 },
]

const masonryItems = [
  { label: 'Masonry 1', height: 200 },
  { label: 'Masonry 2', height: 280 },
  { label: 'Masonry 3', height: 180 },
  { label: 'Masonry 4', height: 320 },
  { label: 'Masonry 5', height: 240 },
  { label: 'Masonry 6', height: 300 },
  { label: 'Masonry 7', height: 160 },
  { label: 'Masonry 8', height: 260 },
  { label: 'Masonry 9', height: 220 },
  { label: 'Masonry 10', height: 340 },
]

export default function PrimitivesPage() {
  return (
    <main className="min-h-screen bg-void px-6 py-16 text-cream">
      {/* Page Header */}
      <header className="mx-auto max-w-5xl text-center">
        <h1 className="font-display text-4xl font-bold text-gold">
          UI Primitives Test Harness
        </h1>
        <p className="mt-3 font-body text-warm-gray">
          Phase 3 — visual verification of reusable components
        </p>
      </header>

      {/* MotionWrapper Demo */}
      <section className="mx-auto max-w-5xl py-24">
        <h2 className="font-display text-2xl font-semibold text-gold mb-2">
          MotionWrapper
        </h2>
        <p className="font-body text-warm-gray mb-8">
          Scroll down to see items reveal with fade + translateY animation.
          Each item has a staggered delay.
        </p>
        <div className="space-y-6">
          {revealItems.map((item) => (
            <MotionWrapper key={item.label} delay={item.delay}>
              <div className="rounded bg-charcoal p-6 border border-gold-dim/20">
                <p className="font-body text-cream">{item.label}</p>
                <p className="font-body text-sm text-warm-gray mt-1">
                  delay: {item.delay}s
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </section>

      {/* ParallaxWrapper Demo */}
      <section className="mx-auto max-w-5xl py-24">
        <h2 className="font-display text-2xl font-semibold text-gold mb-2">
          ParallaxWrapper
        </h2>
        <p className="font-body text-warm-gray mb-8">
          Scroll to see depth difference between background (0.5x) and
          foreground (0.9x) elements.
        </p>
        <div className="relative min-h-[80vh] flex items-center justify-center">
          <ParallaxWrapper speed={0.5} className="absolute inset-0 flex items-center justify-center">
            <div className="rounded border-2 border-gold-dim p-12 w-80 h-80 flex items-center justify-center">
              <p className="font-body text-gold-dim text-lg text-center">
                Background 0.5x
              </p>
            </div>
          </ParallaxWrapper>
          <ParallaxWrapper speed={0.9} className="relative z-10">
            <div className="rounded border-2 border-gold bg-charcoal/80 p-8 w-48 h-48 flex items-center justify-center">
              <p className="font-body text-gold text-lg text-center">
                Foreground 0.9x
              </p>
            </div>
          </ParallaxWrapper>
        </div>
      </section>

      {/* MasonryGrid Demo */}
      <section className="mx-auto max-w-5xl py-24">
        <h2 className="font-display text-2xl font-semibold text-gold mb-2">
          MasonryGrid
        </h2>
        <p className="font-body text-warm-gray mb-8">
          Responsive masonry: 3 columns desktop, 2 tablet, 1 mobile. Items have
          varying heights to demonstrate the staggered layout.
        </p>
        <MasonryGrid>
          {masonryItems.map((item) => (
            <MasonryItem key={item.label}>
              <div
                className="rounded bg-charcoal border border-gold-dim/30 flex items-center justify-center"
                style={{ height: `${item.height}px` }}
              >
                <p className="font-body text-cream text-sm">{item.label}</p>
              </div>
            </MasonryItem>
          ))}
        </MasonryGrid>
      </section>

      {/* Footer note */}
      <footer className="mx-auto max-w-5xl py-12 text-center">
        <p className="font-body text-sm text-warm-gray/60">
          This page is for development verification only.
        </p>
      </footer>
    </main>
  )
}
