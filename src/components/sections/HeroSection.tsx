'use client'

import Image from 'next/image'
import { m, useReducedMotion } from 'motion/react'

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background image */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-[1400px] mx-auto w-full">
        {shouldReduceMotion ? (
          <div>
            <div className="flex items-center gap-4 mb-0">
              <div className="h-px w-12 bg-white/60" />
              <span className="font-body text-xs tracking-[0.4em] uppercase text-white/70">
                Custom Metal Fabrication
              </span>
            </div>

            <h1 className="-my-12">
              <Image
                src="/satinsidelogo.webp"
                alt="Satin Fabrication"
                width={600}
                height={200}
                priority
                className="w-[300px] md:w-[440px] lg:w-[540px] h-auto brightness-0 invert -ml-10 md:-ml-14"
              />
              <span className="sr-only">Satin Fabrication — Custom Metal Fabrication in Southern Ontario</span>
            </h1>

            <div className="h-px w-24 bg-white/30 mt-0 mb-4" />

            <p className="font-body text-white/80 text-base md:text-lg max-w-md leading-relaxed">
              Custom steel and stainless fabrication. Give us your
              idea&nbsp;&mdash; we&apos;ll bring it to life.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="/#work"
                className="px-10 py-4 bg-white text-gray-900 font-body text-xs tracking-[0.3em] uppercase hover:bg-white/90 transition-colors focus-gold"
              >
                View Our Work
              </a>
              <a
                href="/#contact"
                className="font-body text-xs tracking-[0.3em] uppercase text-white/80 hover:text-white transition-colors focus-gold flex items-center gap-3"
              >
                <span>Start a Project</span>
                <svg width="24" height="1" viewBox="0 0 24 1" fill="none" aria-hidden="true">
                  <line x1="0" y1="0.5" x2="24" y2="0.5" stroke="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div>
            <m.div
              className="flex items-center gap-4 mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease }}
            >
              <m.div
                className="h-px bg-white/60 origin-left"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
              />
              <span className="font-body text-xs tracking-[0.4em] uppercase text-white/70">
                Custom Metal Fabrication
              </span>
            </m.div>

            <m.h1
              className="-my-12"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1, ease }}
            >
              <Image
                src="/satinsidelogo.webp"
                alt="Satin Fabrication"
                width={600}
                height={200}
                priority
                className="w-[300px] md:w-[440px] lg:w-[540px] h-auto brightness-0 invert -ml-10 md:-ml-14"
              />
              <span className="sr-only">Satin Fabrication — Custom Metal Fabrication in Southern Ontario</span>
            </m.h1>

            <m.div
              className="mt-0 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease }}
            >
              <m.div
                className="h-px bg-white/30 origin-left"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.7, ease }}
              />
            </m.div>

            <m.p
              className="font-body text-white/80 text-base md:text-lg max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease }}
            >
              Custom steel and stainless fabrication. Give us your
              idea&nbsp;&mdash; we&apos;ll bring it to life.
            </m.p>

            <m.div
              className="mt-10 flex flex-wrap items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease }}
            >
              <a
                href="/#work"
                className="px-10 py-4 bg-white text-gray-900 font-body text-xs tracking-[0.3em] uppercase hover:bg-white/90 transition-colors focus-gold"
              >
                View Our Work
              </a>
              <a
                href="/#contact"
                className="font-body text-xs tracking-[0.3em] uppercase text-white/80 hover:text-white transition-colors focus-gold flex items-center gap-3 group"
              >
                <span>Start a Project</span>
                <svg width="24" height="1" viewBox="0 0 24 1" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  <line x1="0" y1="0.5" x2="24" y2="0.5" stroke="currentColor" />
                </svg>
              </a>
            </m.div>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        {shouldReduceMotion ? (
          <>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
            <div className="h-10 w-px bg-white/30" />
          </>
        ) : (
          <>
            <m.span
              className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              Scroll
            </m.span>
            <m.div
              className="h-10 w-px bg-white/30"
              initial={{ scaleY: 0, transformOrigin: 'top' }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 1.6, ease }}
            />
          </>
        )}
      </div>
    </section>
  )
}
