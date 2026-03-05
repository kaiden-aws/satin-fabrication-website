'use client'

import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { ProcessTimeline } from '@/components/ui/ProcessTimeline'
import { PROCESS_STEPS } from '@/lib/constants'

export function ProcessSection() {
  return (
    <section id="process" className="py-24 px-6 bg-charcoal/50">
      <div className="mx-auto max-w-4xl">
        <MotionWrapper>
          <h2 className="font-display text-4xl md:text-5xl text-cream text-center mb-16">
            OUR <span className="text-gold">PROCESS</span>
          </h2>
        </MotionWrapper>

        <MotionWrapper delay={0.1}>
          <p className="font-body text-warm-gray text-center mb-16 max-w-2xl mx-auto">
            From concept to completion, every project follows our proven
            five-step approach.
          </p>
        </MotionWrapper>

        <ProcessTimeline steps={PROCESS_STEPS} />
      </div>
    </section>
  )
}
