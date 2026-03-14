'use client'

import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface TimelineStep {
  number: string
  title: string
  description: string
}

interface ProcessTimelineProps {
  steps: readonly TimelineStep[]
  className?: string
}

export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className={cn(className)}>
      <div className="relative">
        {/* SVG connecting line */}
        <svg
          className="absolute left-4 top-0 h-full w-1"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1="1" y1="0" x2="1" y2="100"
            stroke="var(--color-slate)"
            strokeWidth="2"
          />
          <m.line
            x1="1" y1="0" x2="1" y2="100"
            stroke="var(--color-burnished)"
            strokeWidth="2"
            style={{ pathLength: shouldReduceMotion ? 1 : pathLength }}
            strokeDasharray="0 1"
          />
        </svg>

        {/* Steps */}
        {steps.map((step, i) =>
          shouldReduceMotion ? (
            <div
              key={step.number}
              className={cn(
                'relative pl-14 pb-14',
                i === steps.length - 1 && 'pb-0'
              )}
            >
              <div className="absolute left-2 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-burnished bg-void" />
              <span className="font-display text-5xl font-light text-burnished/15 select-none leading-none">
                {step.number}
              </span>
              <h3 className="-mt-6 font-display text-xl font-light text-ivory relative z-10">
                {step.title}
              </h3>
              <div className="mt-3 h-px w-6 bg-burnished/30" />
              <p className="mt-3 font-body text-stone text-sm leading-relaxed">{step.description}</p>
            </div>
          ) : (
            <m.div
              key={step.number}
              className={cn(
                'relative pl-14 pb-14',
                i === steps.length - 1 && 'pb-0'
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="absolute left-2 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-burnished bg-void" />
              <span className="font-display text-5xl font-light text-burnished/15 select-none leading-none">
                {step.number}
              </span>
              <h3 className="-mt-6 font-display text-xl font-light text-ivory relative z-10">
                {step.title}
              </h3>
              <div className="mt-3 h-px w-6 bg-burnished/30" />
              <p className="mt-3 font-body text-stone text-sm leading-relaxed">{step.description}</p>
            </m.div>
          )
        )}
      </div>
    </div>
  )
}
