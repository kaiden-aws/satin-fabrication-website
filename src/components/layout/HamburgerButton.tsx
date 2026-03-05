'use client'

import { m } from 'motion/react'

const topLineVariants = {
  closed: { d: 'M4 8L20 8' },
  open: { d: 'M4 4L20 20' },
}

const bottomLineVariants = {
  closed: { d: 'M4 16L20 16' },
  open: { d: 'M4 20L20 4' },
}

interface HamburgerButtonProps {
  isOpen: boolean
  toggle: () => void
}

export function HamburgerButton({ isOpen, toggle }: HamburgerButtonProps) {
  return (
    <button
      onClick={toggle}
      className="relative z-[70] p-2 md:hidden"
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <m.path
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          variants={topLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <m.path
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          variants={bottomLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </svg>
    </button>
  )
}
