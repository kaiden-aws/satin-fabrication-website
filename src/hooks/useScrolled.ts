'use client'

import { useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'

export function useScrolled(threshold = 50) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > threshold)
  })

  return scrolled
}
