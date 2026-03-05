'use client'

import { m } from 'motion/react'
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MotionWrapperProps {
  children: ReactNode
  delay?: number
  className?: string
  as?: ElementType
}

export function MotionWrapper({
  children,
  delay = 0,
  className,
  as: _as = 'div',
}: MotionWrapperProps) {
  // LazyMotion strict mode requires m.* components — motion.* will throw
  // MotionConfig reducedMotion="user" in Providers auto-suppresses animation
  // when OS prefers-reduced-motion is enabled
  const Component = m[_as as keyof typeof m] as typeof m.div

  return (
    <Component
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </Component>
  )
}
