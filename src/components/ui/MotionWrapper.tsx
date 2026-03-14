'use client'

import { m, useReducedMotion } from 'motion/react'
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
  const shouldReduceMotion = useReducedMotion()

  // When reduced motion is preferred, render static content in final state
  // — no opacity fade, no y transform, no animation wrapper
  if (shouldReduceMotion) {
    const Tag = _as as ElementType
    return <Tag className={cn(className)}>{children}</Tag>
  }

  // LazyMotion strict mode requires m.* components — motion.* will throw
  const Component = m[_as as keyof typeof m] as typeof m.div

  return (
    <Component
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </Component>
  )
}
