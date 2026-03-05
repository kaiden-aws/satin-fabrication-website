import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { SERVICES_EXPANDED } from '@/lib/constants'
import { generateServicePageJsonLd } from '@/lib/jsonld'
import { MotionWrapper } from '@/components/ui/MotionWrapper'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Custom railings, gates, furniture, and fireplace surrounds. Explore our full range of architectural metalwork services for Southern Ontario homes.',
  openGraph: {
    title: 'Our Services | Satin Fabrication',
    description:
      'Custom railings, gates, furniture, and fireplace surrounds. Explore our full range of architectural metalwork services.',
  },
}

export default function ServicesPage() {
  return (
    <>
      {process.env.NEXT_PUBLIC_ENABLE_JSONLD === 'true' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateServicePageJsonLd()).replace(
              /</g,
              '\\u003c'
            ),
          }}
        />
      )}

      <main id="main-content">
        {/* Hero banner */}
        <section className="relative py-32 px-6 bg-gradient-to-b from-charcoal via-surface to-void">
          <div className="mx-auto max-w-6xl text-center">
            <MotionWrapper>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream">
                Our <span className="text-gold">Services</span>
              </h1>
              <p className="mt-6 font-body text-lg md:text-xl text-cream max-w-2xl mx-auto">
                Premium craftsmanship for Southern Ontario&apos;s finest homes
              </p>
              <div
                aria-hidden="true"
                className="mt-8 mx-auto h-[1px] w-24 bg-gold/50"
              />
            </MotionWrapper>
          </div>
        </section>

        {/* Service detail sections */}
        {SERVICES_EXPANDED.map((service, index) => {
          const isEven = index % 2 === 1
          const isFirst = index === 0

          return (
            <section
              key={service.id}
              aria-labelledby={`service-${service.id}`}
              className="py-24 px-6"
            >
              <div className="mx-auto max-w-6xl">
                <MotionWrapper>
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                      isEven ? 'lg:direction-rtl' : ''
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`rounded overflow-hidden ${
                        isEven ? 'lg:order-2 lg:direction-ltr' : ''
                      }`}
                    >
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        priority={isFirst}
                      />
                    </div>

                    {/* Text content */}
                    <div className={isEven ? 'lg:order-1 lg:direction-ltr' : ''}>
                      <p className="font-body text-gold text-sm uppercase tracking-widest">
                        {service.tagline}
                      </p>
                      <h2
                        id={`service-${service.id}`}
                        className="mt-3 font-display text-3xl md:text-4xl text-cream"
                      >
                        {service.title}
                      </h2>
                      <p className="mt-6 font-body text-cream leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features list */}
                      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-cream text-sm font-body"
                          >
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                              aria-hidden="true"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </MotionWrapper>
              </div>
            </section>
          )
        })}

        {/* CTA section */}
        <section className="py-24 px-6 bg-gradient-to-b from-void via-surface to-void">
          <div className="mx-auto max-w-6xl text-center">
            <MotionWrapper>
              <h2 className="font-display text-3xl md:text-4xl text-cream">
                Ready to Start Your{' '}
                <span className="text-gold">Project</span>?
              </h2>
              <p className="mt-4 font-body text-cream max-w-lg mx-auto">
                Tell us about your vision and we&apos;ll bring it to life in
                metal.
              </p>
              <Link
                href="/#contact"
                className="mt-8 inline-block px-8 py-3 border border-gold text-gold font-body text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-void btn-glow focus-gold"
              >
                GET IN TOUCH
              </Link>
            </MotionWrapper>
          </div>
        </section>
      </main>
    </>
  )
}
