'use client'

import { useState } from 'react'
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
        className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 ${scrolled ? 'backdrop-blur-md' : ''}`}
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? 'rgba(10, 10, 10, 0.95)'
            : 'rgba(10, 10, 10, 0)',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <a href="/" className="font-display text-xl text-gold tracking-wider">
            SATIN
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-8 items-center">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
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
