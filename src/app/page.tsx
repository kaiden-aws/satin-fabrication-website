'use client'

import { m } from 'motion/react'

export default function HomePage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center pt-20">
      <m.h1
        className="font-display text-6xl text-cream"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        SATIN <span className="text-gold">FABRICATION</span>
      </m.h1>
      <m.p
        className="mt-4 font-body text-warm-gray text-lg tracking-wide uppercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Custom Architectural Metalwork
      </m.p>
      <m.div
        className="mt-8 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="h-16 w-16 rounded bg-void border border-gold" />
        <div className="h-16 w-16 rounded bg-charcoal border border-gold" />
        <div className="h-16 w-16 rounded bg-surface border border-gold-light" />
        <div className="h-16 w-16 rounded bg-gold" />
        <div className="h-16 w-16 rounded bg-cream" />
        <div className="h-16 w-16 rounded bg-warm-gray" />
      </m.div>
      <p className="mt-4 text-sm text-warm-gray">
        Foundation verified: tokens, fonts, LazyMotion, grain overlay
      </p>
    </main>
  )
}
