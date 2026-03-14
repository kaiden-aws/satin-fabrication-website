'use client'

import Image from 'next/image'
import { PROJECT_TYPES } from '@/lib/constants'
import { MotionWrapper } from '@/components/ui/MotionWrapper'

export function ServicesSection() {
  return (
    <section id="services" className="py-32 px-8 md:px-16 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <MotionWrapper>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-burnished/40" />
            <span className="font-body text-xs tracking-[0.4em] uppercase text-stone">
              What We Do
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-ivory leading-[0.9]">
            Custom Design
            <span className="text-burnished"> & Fabrication</span>
          </h2>
          <p className="mt-8 font-body text-stone text-sm md:text-base leading-relaxed max-w-2xl">
            We design and build custom metalwork from scratch. Steel, stainless — whatever the project calls for.
            Bring us your idea and we&apos;ll make it happen.
          </p>
        </MotionWrapper>

        {/* Project type examples */}
        <div className="mt-20 space-y-24">
          {PROJECT_TYPES.map((project, i) => {
            const isEven = i % 2 === 1
            return (
              <MotionWrapper key={project.title} delay={0.1}>
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isEven ? 'lg:direction-rtl' : ''
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`lg:col-span-7 img-reveal rounded-sm ${
                      isEven ? 'lg:order-2 lg:direction-ltr' : ''
                    }`}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={640}
                      height={400}
                      className="w-full h-auto aspect-[16/10] object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`lg:col-span-5 ${
                      isEven ? 'lg:order-1 lg:direction-ltr lg:text-right' : ''
                    }`}
                  >
                    {/* Large index number */}
                    <span className="font-display text-8xl lg:text-9xl font-light text-burnished/10 leading-none select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <h3 className="font-display text-2xl md:text-3xl text-ivory font-light -mt-6 relative z-10">
                      {project.title}
                    </h3>

                    <div className={`mt-4 h-px w-12 bg-burnished/30 ${isEven ? 'ml-auto' : ''}`} />

                    <p className="mt-6 font-body text-stone text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <a
                      href="/services"
                      className={`mt-6 inline-flex items-center gap-3 font-body text-xs tracking-[0.2em] uppercase text-burnished hover:text-burnished-light transition-colors focus-gold group ${
                        isEven ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <span>Learn More</span>
                      <svg
                        width="20"
                        height="1"
                        viewBox="0 0 20 1"
                        fill="none"
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="currentColor" />
                      </svg>
                    </a>
                  </div>
                </div>
              </MotionWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
