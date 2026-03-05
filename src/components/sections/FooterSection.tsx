'use client'

import { Instagram, Facebook, Linkedin } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'

const iconMap: Record<string, typeof Instagram> = {
  Instagram,
  Facebook,
  Linkedin,
}

export function FooterSection() {
  return (
    <footer className="py-16 px-6 border-t border-charcoal/50">
      <div className="mx-auto max-w-6xl">
        {/* Top area — 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Column 1 — Company info */}
          <div>
            <h3 className="font-display text-2xl text-cream">
              SATIN FABRICATION
            </h3>
            <p className="mt-2 font-body text-warm-gray text-sm">
              Custom Architectural Metalwork
            </p>
            <p className="mt-4 font-body text-warm-gray/70 text-sm">
              Proudly serving Southern Ontario&apos;s finest homes
            </p>
          </div>

          {/* Column 2 — Contact details */}
          <div>
            <h4 className="font-display text-lg text-cream mb-4">Contact</h4>
            <a
              href="tel:+15551234567"
              className="block font-body text-cream hover:text-gold transition-colors"
            >
              (555) 123-4567
            </a>
            <a
              href="mailto:info@satinfabrication.com"
              className="block mt-2 font-body text-cream hover:text-gold transition-colors"
            >
              info@satinfabrication.com
            </a>
          </div>

          {/* Column 3 — Social links */}
          <div>
            <h4 className="font-display text-lg text-cream mb-4">Follow Us</h4>
            <div className="flex gap-4">
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
                    className="text-warm-gray hover:text-gold transition-colors duration-300"
                  >
                    <IconComponent size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-charcoal/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-warm-gray/70">
            &copy; {new Date().getFullYear()} Satin Fabrication. All rights
            reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-body text-sm text-warm-gray hover:text-gold transition-colors inline-flex items-center gap-1"
            aria-label="Scroll to top"
          >
            Back to Top
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="ml-1"
            >
              <path
                d="M6 10V2M6 2L2 6M6 2L10 6"
                stroke="currentColor"
                strokeWidth="1.5"
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
