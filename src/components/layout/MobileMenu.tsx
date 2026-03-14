'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { m, AnimatePresence, useReducedMotion } from 'motion/react'
import { NAV_LINKS } from '@/lib/constants'

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
}

const listVariants = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  closed: { opacity: 0, x: -30 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const main = document.getElementById('main-content')
      if (main) main.setAttribute('inert', '')
    } else {
      document.body.style.overflow = ''
      const main = document.getElementById('main-content')
      if (main) main.removeAttribute('inert')
    }

    return () => {
      document.body.style.overflow = ''
      const main = document.getElementById('main-content')
      if (main) main.removeAttribute('inert')
    }
  }, [isOpen])

  const instantTransition = { duration: 0 }

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="mobile-menu"
          className="fixed inset-0 z-[60] flex flex-col justify-center"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={shouldReduceMotion ? instantTransition : { duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 50%, #FFFFFF 100%)',
          }}
        >
          {/* Logo at top */}
          <m.div
            className="absolute top-8 left-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? instantTransition : { duration: 0.4, delay: 0.1 }}
          >
            <a href="/" onClick={onClose} className="inline-block focus-gold">
              <Image
                src="/logo.webp"
                alt="Satin Fabrication"
                width={120}
                height={42}
                className="h-10 w-auto object-contain"
              />
            </a>
          </m.div>

          {/* Decorative elements */}
          <div aria-hidden="true" className="absolute top-1/4 right-12 w-px h-32 bg-burnished/10" />
          <div aria-hidden="true" className="absolute bottom-1/4 left-12 w-24 h-px bg-burnished/10" />

          <m.ul
            className="flex flex-col items-start px-12 gap-6"
            variants={listVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={
              shouldReduceMotion
                ? { staggerChildren: 0, delayChildren: 0 }
                : undefined
            }
          >
            {NAV_LINKS.map((link) => (
              <m.li
                key={link.href}
                variants={itemVariants}
                transition={shouldReduceMotion ? instantTransition : undefined}
              >
                <a
                  href={link.href}
                  className="font-display text-5xl font-light text-ivory/80 hover:text-burnished transition-colors duration-300 focus-gold"
                  onClick={onClose}
                >
                  {link.label}
                </a>
              </m.li>
            ))}
            <m.li
              variants={itemVariants}
              transition={shouldReduceMotion ? instantTransition : undefined}
              className="mt-4"
            >
              <a
                href="/#contact"
                className="btn-primary px-8 py-3 font-body text-xs tracking-[0.3em] uppercase focus-gold inline-block"
                onClick={onClose}
              >
                Get a Quote
              </a>
            </m.li>
          </m.ul>

          {/* Bottom info */}
          <m.div
            className="absolute bottom-12 left-12 right-12 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-stone/50">
              Custom Metal Fabrication
            </span>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-stone/50">
              Southern Ontario
            </span>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
