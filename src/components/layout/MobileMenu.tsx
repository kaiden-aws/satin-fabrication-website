'use client'

import { useEffect } from 'react'
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
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
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

  // Instant transitions when reduced motion is preferred
  // Menu open/close is functional — but stagger/fade is decorative
  const instantTransition = { duration: 0 }

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="mobile-menu"
          className="fixed inset-0 z-[60] bg-void flex flex-col items-center justify-center"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={shouldReduceMotion ? instantTransition : { duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <m.ul
            className="flex flex-col items-center gap-8"
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
                  className="font-display text-4xl text-cream hover:text-gold transition-colors focus-gold"
                  onClick={onClose}
                >
                  {link.label}
                </a>
              </m.li>
            ))}
          </m.ul>
        </m.div>
      )}
    </AnimatePresence>
  )
}
