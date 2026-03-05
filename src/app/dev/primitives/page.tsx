'use client'

import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { ParallaxWrapper } from '@/components/ui/ParallaxWrapper'
import { MasonryGrid, MasonryItem } from '@/components/ui/MasonryGrid'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'
import { ProcessTimeline } from '@/components/ui/ProcessTimeline'
import { ScrollAssembly } from '@/components/ui/ScrollAssembly'

const revealItems = [
  { label: 'Reveal Item 1', delay: 0 },
  { label: 'Reveal Item 2', delay: 0.1 },
  { label: 'Reveal Item 3', delay: 0.2 },
  { label: 'Reveal Item 4', delay: 0.3 },
  { label: 'Reveal Item 5', delay: 0.4 },
  { label: 'Reveal Item 6', delay: 0.5 },
]

const timelineSteps = [
  {
    number: '01',
    title: 'Consultation',
    description:
      'We discuss your vision, space requirements, and design preferences to understand exactly what you need.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Our team creates detailed CAD drawings and 3D renderings for your approval before any metal is cut.',
  },
  {
    number: '03',
    title: 'Material Selection',
    description:
      'Choose from premium metals — brushed steel, wrought iron, brass, or bronze — each selected for your project.',
  },
  {
    number: '04',
    title: 'Fabrication',
    description:
      'Skilled craftsmen shape, weld, and finish each piece by hand in our Southern Ontario workshop.',
  },
  {
    number: '05',
    title: 'Installation',
    description:
      'We deliver and install with precision, ensuring every detail meets our exacting standards.',
  },
]

const assemblyPieces = [
  { id: 'piece-1', label: 'Rail', initialX: -200, initialY: -150, initialRotate: -25 },
  { id: 'piece-2', label: 'Post', initialX: 180, initialY: -100, initialRotate: 15 },
  { id: 'piece-3', label: 'Cap', initialX: -150, initialY: 120, initialRotate: 30 },
  { id: 'piece-4', label: 'Base', initialX: 200, initialY: 80, initialRotate: -20 },
  { id: 'piece-5', label: 'Bracket', initialX: -50, initialY: -200, initialRotate: 45 },
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

      {/* BeforeAfterSlider Demo */}
      <section className="mx-auto max-w-5xl py-24">
        <h2 className="font-display text-2xl font-semibold text-gold mb-2">
          BeforeAfterSlider
        </h2>
        <p className="font-body text-warm-gray mb-8">
          Drag the gold handle or use arrow keys to compare before and after
          states.
        </p>
        <BeforeAfterSlider
          beforeSrc="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop"
          afterSrc="https://images.unsplash.com/photo-1504917595217-d4dc5efe5a74?w=800&h=500&fit=crop"
          beforeAlt="Raw metal before fabrication"
          afterAlt="Finished metalwork after fabrication"
          className="mx-auto max-w-2xl"
        />
      </section>

      {/* ProcessTimeline Demo */}
      <section className="mx-auto max-w-5xl py-24">
        <h2 className="font-display text-2xl font-semibold text-gold mb-2">
          ProcessTimeline
        </h2>
        <p className="font-body text-warm-gray mb-8">
          Scroll to watch the gold connecting line draw between steps.
        </p>
        <ProcessTimeline steps={timelineSteps} className="max-w-xl" />
      </section>

      {/* ScrollAssembly Demo */}
      <section className="mx-auto max-w-5xl py-24">
        <h2 className="font-display text-2xl font-semibold text-gold mb-2">
          ScrollAssembly
        </h2>
        <p className="font-body text-warm-gray mb-8">
          Scroll through to watch scattered pieces converge into an assembled
          form.
        </p>
        <ScrollAssembly pieces={assemblyPieces} />
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
