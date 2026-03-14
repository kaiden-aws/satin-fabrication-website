'use client'

import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { ProcessTimeline } from '@/components/ui/ProcessTimeline'
import { PROCESS_STEPS } from '@/lib/constants'

export function ProcessSection() {
  return (
    <section id="process" className="py-32 px-8 md:px-16 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <MotionWrapper>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-burnished/40" />
                <span className="font-body text-xs tracking-[0.4em] uppercase text-stone">
                  How We Work
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-ivory leading-[0.9]">
                Our
                <span className="text-burnished"> Process</span>
              </h2>
            </div>
            <p className="font-body text-stone text-sm max-w-sm leading-relaxed md:text-right">
              From first conversation to finished product — here&apos;s how we get it done.
            </p>
          </div>
        </MotionWrapper>

        {/* Horizontal process cards on desktop, vertical on mobile */}
        <div className="hidden md:block">
          <div className="grid grid-cols-5 gap-px bg-burnished/10 rounded-sm overflow-hidden">
            {PROCESS_STEPS.map((step, i) => (
              <MotionWrapper key={step.number} delay={i * 0.1}>
                <div className="bg-void p-8 h-full group hover:bg-obsidian transition-colors duration-500">
                  {/* Step number */}
                  <span className="font-display text-5xl font-light text-burnished/20 group-hover:text-burnished/40 transition-colors duration-500">
                    {step.number}
                  </span>

                  {/* Divider */}
                  <div className="mt-4 mb-5 h-px w-6 bg-burnished/30 group-hover:w-10 transition-all duration-500" />

                  {/* Title */}
                  <h3 className="font-display text-lg text-ivory font-light">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 font-body text-stone text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden">
          <ProcessTimeline steps={PROCESS_STEPS} />
        </div>
      </div>
    </section>
  )
}
