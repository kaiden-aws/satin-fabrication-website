'use client'

import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface TimelineStep {
  number: string
  title: string
  description: string
}

interface ProcessTimelineProps {
  steps: TimelineStep[]
  className?: string
}

export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className={cn(className)}>
      <div className="relative">
        {/* SVG connecting line — decorative */}
        <svg
          className="absolute left-6 top-0 h-full w-1"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Background track */}
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="var(--color-charcoal)"
            strokeWidth="2"
          />
          {/* Animated gold line — strokeDasharray="0 1" prevents SSR flash */}
          <m.line
            x1="1"
            y1="0"
            x2="1"
            y2="100"
            stroke="var(--color-gold)"
            strokeWidth="2"
            style={{ pathLength }}
            strokeDasharray="0 1"
          />
        </svg>

        {/* Steps */}
        {steps.map((step, i) => (
          <m.div
            key={step.number}
            className={cn(
              'relative pl-16 pb-16',
              i === steps.length - 1 && 'pb-0'
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.7,
              delay: i * 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* Step dot on the line */}
            <div className="absolute left-4 top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-gold bg-void" />

            {/* Large step number (background decoration) */}
            <span className="font-display text-6xl font-bold text-gold/10 select-none">
              {step.number}
            </span>

            {/* Title — overlaps the large number */}
            <h3 className="-mt-8 font-display text-xl font-semibold text-cream">
              {step.title}
            </h3>

            {/* Description */}
            <p className="mt-2 font-body text-warm-gray">{step.description}</p>
          </m.div>
        ))}
      </div>
    </div>
  )
}
