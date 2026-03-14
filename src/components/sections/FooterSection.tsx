'use client'

import Image from 'next/image'
import { Instagram, Facebook } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'

const iconMap: Record<string, typeof Instagram> = { Instagram, Facebook }

export function FooterSection() {
  return (
    <footer className="relative py-24 px-8 md:px-16 lg:px-24 overflow-hidden">
      {/* Large background watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-display text-[clamp(8rem,25vw,20rem)] font-light text-burnished/[0.05] tracking-wider">
          SATIN
        </span>
      </div>

      {/* Top divider */}
      <div className="section-divider max-w-[1400px] mb-20" />

      <div className="mx-auto max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <a href="/" className="inline-block focus-gold">
              <Image
                src="/logo.webp"
                alt="Satin Fabrication"
                width={120}
                height={124}
                className="h-14 w-auto object-contain"
              />
            </a>
            <p className="mt-3 font-body text-xs tracking-[0.2em] uppercase text-stone">
              Custom Metal Fabrication
            </p>
            <p className="mt-6 font-body text-stone/70 text-sm max-w-xs leading-relaxed">
              Custom steel and stainless fabrication in Southern Ontario.
              If you can think of it, we can build it.
            </p>
          </div>

          {/* Navigation column */}
          <div className="md:col-span-3">
            <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-stone mb-6">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              <a href="/#work" className="font-body text-sm text-ivory/70 hover:text-burnished transition-colors focus-gold">
                Portfolio
              </a>
              <a href="/services" className="font-body text-sm text-ivory/70 hover:text-burnished transition-colors focus-gold">
                Services
              </a>
              <a href="/#process" className="font-body text-sm text-ivory/70 hover:text-burnished transition-colors focus-gold">
                Process
              </a>
              <a href="/#contact" className="font-body text-sm text-ivory/70 hover:text-burnished transition-colors focus-gold">
                Contact
              </a>
            </nav>
          </div>

          {/* Contact column */}
          <div className="md:col-span-4">
            <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-stone mb-6">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+12263430035"
                className="block font-body text-sm text-ivory/70 hover:text-burnished transition-colors focus-gold"
              >
                (226) 343-0035
              </a>
              <a
                href="mailto:kaiden@satinfabrication.ca"
                className="block font-body text-sm text-ivory/70 hover:text-burnished transition-colors focus-gold"
              >
                kaiden@satinfabrication.ca
              </a>
            </div>

            {/* Social */}
            <div className="flex gap-5 mt-8">
              {SOCIAL_LINKS.map((link) => {
                const IconComponent = iconMap[link.icon]
                if (!IconComponent) return null
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone hover:text-burnished transition-colors duration-300 focus-gold"
                  >
                    <IconComponent size={18} strokeWidth={1.5} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 border-t border-slate/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-stone/50">
            &copy; {new Date().getFullYear()} Satin Fabrication. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-body text-xs text-stone/50 hover:text-burnished transition-colors inline-flex items-center gap-2 focus-gold group"
            aria-label="Scroll to top"
          >
            <span>Back to Top</span>
            <svg
              aria-hidden="true"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <path
                d="M5 9V1M5 1L1 5M5 1L9 5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
