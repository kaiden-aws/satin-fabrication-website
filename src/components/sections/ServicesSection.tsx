'use client'

import Image from 'next/image'
import { SERVICES } from '@/lib/constants'
import { MotionWrapper } from '@/components/ui/MotionWrapper'

export function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <MotionWrapper>
          <h2 className="font-display text-4xl md:text-5xl text-cream text-center mb-16">
            OUR <span className="text-gold">SERVICES</span>
          </h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => (
            <MotionWrapper key={service.title} delay={i * 0.1}>
              <div className="group bg-surface border border-gold-dim/30 rounded overflow-hidden transition-colors duration-300 hover:border-gold">
                <div className="overflow-hidden aspect-[16/10]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={640}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-cream">
                    {service.title}
                  </h3>
                  <p className="mt-2 font-body text-warm-gray text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <a
                    href="#contact"
                    className="mt-4 inline-block font-body text-sm text-gold hover:text-gold-light transition-colors"
                  >
                    Learn More &rarr;
                  </a>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
