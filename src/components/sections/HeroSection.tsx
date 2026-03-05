'use client'

import { m, useReducedMotion } from 'motion/react'

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background — frozen when reduced motion */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 25%, #111111 50%, #0D0D0D 75%, #0A0A0A 100%)',
          backgroundSize: '400% 400%',
          animation: shouldReduceMotion ? 'none' : 'heroGradient 20s ease infinite',
        }}
      />

      {/* Dark overlay */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {shouldReduceMotion ? (
          <>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream tracking-tight">
              <span className="text-gold">SATIN</span> FABRICATION
            </h1>

            <p className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-warm-gray mt-4 md:mt-6">
              CUSTOM ARCHITECTURAL METALWORK
            </p>

            <div>
              <a
                href="/#work"
                className="inline-block px-8 py-3 mt-8 border border-gold text-gold font-body text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-void btn-glow focus-gold"
              >
                VIEW OUR WORK
              </a>
            </div>
          </>
        ) : (
          <>
            <m.h1
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-gold">SATIN</span> FABRICATION
            </m.h1>

            <m.p
              className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-warm-gray mt-4 md:mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              CUSTOM ARCHITECTURAL METALWORK
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <a
                href="/#work"
                className="inline-block px-8 py-3 mt-8 border border-gold text-gold font-body text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-void btn-glow focus-gold"
              >
                VIEW OUR WORK
              </a>
            </m.div>
          </>
        )}
      </div>

      {/* Pulsing scroll indicator — static when reduced motion */}
      {shouldReduceMotion ? (
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="h-8 w-[1px] bg-gold/50" />
        </div>
      ) : (
        <m.div
          aria-hidden="true"
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-8 w-[1px] bg-gold/50" />
        </m.div>
      )}
    </section>
  )
}
