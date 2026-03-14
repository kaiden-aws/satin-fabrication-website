'use client'

import { useState } from 'react'
import Image from 'next/image'
import { m } from 'motion/react'
import { useScrolled } from '@/hooks/useScrolled'
import { NAV_LINKS } from '@/lib/constants'
import { NavLink } from '@/components/layout/NavLink'
import { HamburgerButton } from '@/components/layout/HamburgerButton'
import { MobileMenu } from '@/components/layout/MobileMenu'

export function Navbar() {
  const scrolled = useScrolled()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <m.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'py-3 backdrop-blur-xl border-b border-burnished/10'
            : 'py-6'
        }`}
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between px-8 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
          {/* Logo */}
          <a
            href="/"
            className="inline-flex items-center gap-3 focus-gold group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.webp"
              alt="Satin Fabrication"
              className={`h-9 md:h-10 w-auto object-contain transition-all duration-500 ${
                scrolled
                  ? 'mix-blend-multiply'
                  : 'brightness-0 invert mix-blend-screen'
              }`}
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} scrolled={scrolled} />
            ))}
            <a
              href="/#contact"
              className={`px-6 py-2.5 font-body text-[11px] tracking-[0.25em] uppercase focus-gold transition-all duration-500 ${
                scrolled
                  ? 'btn-primary'
                  : 'border border-white text-white hover:bg-white hover:text-slate-900'
              }`}
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile hamburger */}
          <HamburgerButton
            isOpen={mobileMenuOpen}
            toggle={() => setMobileMenuOpen((prev) => !prev)}
          />
        </div>
      </m.nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  )
}
