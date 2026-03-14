import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { SERVICES_EXPANDED } from '@/lib/constants'
import { generateServicePageJsonLd, generateBreadcrumbJsonLd } from '@/lib/jsonld'
import { SITE_CONFIG } from '@/lib/metadata'
import { MotionWrapper } from '@/components/ui/MotionWrapper'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Custom metal fabrication — steel and stainless steel. New builds, repairs, modifications, and full design-build projects.',
  openGraph: {
    title: 'Custom Design & Fabrication | Satin Fabrication',
    description:
      'Custom metal fabrication in Southern Ontario. Steel and stainless — if you can think of it, we can build it.',
  },
  alternates: {
    canonical: '/services',
  },
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateServicePageJsonLd()).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: 'Home', url: SITE_CONFIG.url },
              { name: 'Services', url: `${SITE_CONFIG.url}/services` },
            ])
          ).replace(/</g, '\\u003c'),
        }}
      />

      <main id="main-content">
        {/* Hero banner */}
        <section className="relative py-40 px-8 md:px-16 lg:px-24">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #F5F5F5 0%, #FFFFFF 60%, #FFFFFF 100%)',
            }}
          />
          <div aria-hidden="true" className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-burnished/20 to-transparent" />

          <div className="mx-auto max-w-[1400px] text-center relative z-10">
            <MotionWrapper>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-12 bg-burnished/40" />
                <span className="font-body text-xs tracking-[0.4em] uppercase text-stone">
                  What We Build
                </span>
                <div className="h-px w-12 bg-burnished/40" />
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-8xl font-semibold text-ivory">
                Custom <span className="text-burnished">Fabrication</span>
              </h1>
              <p className="mt-8 font-body text-stone text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                If you can imagine it, we can build it. Full custom design and fabrication
                for any project, any scale.
              </p>
              <div className="flex items-center justify-center mt-10">
                <div className="h-px w-24 bg-burnished/30" />
              </div>
            </MotionWrapper>
          </div>
        </section>

        {/* Project type detail sections */}
        {SERVICES_EXPANDED.map((service, index) => {
          const isEven = index % 2 === 1
          const isFirst = index === 0
          const num = String(index + 1).padStart(2, '0')

          return (
            <section
              key={service.id}
              aria-labelledby={`service-${service.id}`}
              className="py-28 px-8 md:px-16 lg:px-24"
            >
              <div className="mx-auto max-w-[1400px]">
                <MotionWrapper>
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
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
                        src={service.image}
                        alt={service.imageAlt}
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        priority={isFirst}
                      />
                    </div>

                    {/* Text content */}
                    <div className={`lg:col-span-5 ${isEven ? 'lg:order-1 lg:direction-ltr' : ''}`}>
                      {/* Large step number */}
                      <span className="font-display text-8xl font-light text-burnished/10 leading-none select-none">
                        {num}
                      </span>

                      <p className="font-body text-burnished text-xs uppercase tracking-[0.3em] -mt-4 relative z-10">
                        {service.tagline}
                      </p>
                      <h2
                        id={`service-${service.id}`}
                        className="mt-4 font-display text-3xl md:text-4xl text-ivory font-light"
                      >
                        {service.title}
                      </h2>

                      <div className="mt-5 h-px w-12 bg-burnished/30" />

                      <p className="mt-6 font-body text-stone text-sm leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features list */}
                      <ul className="mt-8 space-y-3">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 text-ivory/80 text-sm font-body"
                          >
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-burnished"
                              strokeWidth={1.5}
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
        <section className="py-32 px-8 md:px-16 lg:px-24 relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(37, 99, 235, 1) 0%, transparent 60%)',
            }}
          />
          <div className="mx-auto max-w-[1400px] text-center relative z-10">
            <MotionWrapper>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory">
                Have an Idea?{' '}
                <span className="text-burnished">Let&apos;s Build It</span>
              </h2>
              <p className="mt-6 font-body text-stone text-base max-w-md mx-auto leading-relaxed">
                Tell us what you need and we&apos;ll make it happen. No project is too custom.
              </p>
              <div className="mt-10">
                <Link
                  href="/#contact"
                  className="btn-primary px-12 py-4 font-body text-xs tracking-[0.3em] uppercase focus-gold inline-block"
                >
                  Get in Touch
                </Link>
              </div>
            </MotionWrapper>
          </div>
        </section>
      </main>
    </>
  )
}
