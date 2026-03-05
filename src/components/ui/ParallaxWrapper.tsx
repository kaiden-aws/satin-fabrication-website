'use client'

import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ParallaxWrapperProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function ParallaxWrapper({
  children,
  speed = 0.5,
  className,
}: ParallaxWrapperProps) {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Hooks must be called unconditionally (rules of hooks)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // speed < 1 moves slower (background parallax), speed > 1 moves faster
  const yOffset = (1 - speed) * 200
  const y = useTransform(scrollYProgress, [0, 1], [-yOffset, yOffset])

  return (
    <m.div
      ref={ref}
      style={shouldReduceMotion ? undefined : { y }}
      className={cn(className)}
    >
      {children}
    </m.div>
  )
}
