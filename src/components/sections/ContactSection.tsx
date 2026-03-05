'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'motion/react'
import { contactSchema, type ContactFormData } from '@/lib/schemas'
import { MotionWrapper } from '@/components/ui/MotionWrapper'

const FORMSPREE_URL = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : null

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      if (FORMSPREE_URL) {
        const res = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) {
          setSubmitError('Something went wrong. Please try again.')
          return
        }
      }
      setIsSubmitted(true)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column — headline */}
          <MotionWrapper>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream leading-tight">
              LET&apos;S CREATE SOMETHING
              <br />
              <span className="text-gold">EXTRAORDINARY</span>
            </h2>
            <p className="mt-6 font-body text-warm-gray text-lg">
              Tell us about your vision and we&apos;ll bring it to life in
              metal.
            </p>
            <div
              aria-hidden="true"
              className="mt-8 h-[1px] w-24 bg-gold/50"
            />
          </MotionWrapper>

          {/* Right column — form or success state */}
          <MotionWrapper delay={0.15}>
            {isSubmitted ? (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1] as const,
                }}
                className="flex flex-col items-center justify-center py-16"
              >
                <h3 className="font-display text-3xl text-gold">Thank You</h3>
                <p className="mt-4 font-body text-warm-gray text-center">
                  We&apos;ll be in touch within 24 hours to discuss your
                  project.
                </p>
              </m.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-6"
              >
                {/* Name */}
                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Your Name"
                    aria-label="Your name"
                    className="input-luxury w-full bg-transparent py-3 text-cream placeholder:text-warm-gray/50 font-body"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Email Address"
                    aria-label="Email address"
                    className="input-luxury w-full bg-transparent py-3 text-cream placeholder:text-warm-gray/50 font-body"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="Phone Number"
                    aria-label="Phone number"
                    className="input-luxury w-full bg-transparent py-3 text-cream placeholder:text-warm-gray/50 font-body"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Project Type */}
                <div>
                  <div className="relative">
                    <select
                      {...register('projectType')}
                      aria-label="Project type"
                      className="input-luxury w-full bg-transparent py-3 text-cream font-body appearance-none focus-gold"
                      defaultValue=""
                    >
                      <option value="" disabled className="bg-void">
                        Select Project Type
                      </option>
                      <option value="Railings & Staircases" className="bg-void">
                        Railings &amp; Staircases
                      </option>
                      <option value="Gates & Fencing" className="bg-void">
                        Gates &amp; Fencing
                      </option>
                      <option
                        value="Custom Furniture & Fixtures"
                        className="bg-void"
                      >
                        Custom Furniture &amp; Fixtures
                      </option>
                      <option value="Fireplace Surrounds" className="bg-void">
                        Fireplace Surrounds
                      </option>
                      <option value="Other" className="bg-void">
                        Other
                      </option>
                    </select>
                    {/* Custom chevron */}
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-warm-gray"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {errors.projectType && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <textarea
                    {...register('description')}
                    placeholder="Tell us about your project..."
                    aria-label="Project description"
                    rows={4}
                    className="input-luxury w-full bg-transparent py-3 text-cream placeholder:text-warm-gray/50 font-body resize-none"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 border border-gold text-gold font-body text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-void btn-glow focus-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
                {submitError && (
                  <p className="mt-2 text-sm text-red-400 text-center" role="alert">
                    {submitError}
                  </p>
                )}
              </form>
            )}
          </MotionWrapper>
        </div>
      </div>
    </section>
  )
}
