'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'motion/react'
import { contactSchema, type ContactFormData } from '@/lib/schemas'
import { MotionWrapper } from '@/components/ui/MotionWrapper'

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
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '24341514-c473-4214-b638-be40be4e62b8',
          subject: `New Quote Request: ${data.projectType} — ${data.name}`,
          from_name: 'Satin Fabrication Website',
          name: data.name,
          email: data.email,
          phone: data.phone,
          project_type: data.projectType,
          message: data.description,
        }),
      })
      if (!res.ok) {
        setSubmitError('Something went wrong. Please try again.')
        return
      }
      setIsSubmitted(true)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-32 px-8 md:px-16 lg:px-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column — headline */}
          <MotionWrapper>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-burnished/40" />
                <span className="font-body text-xs tracking-[0.4em] uppercase text-stone">
                  Get in Touch
                </span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory leading-[1.05]">
                Got a Project?
                <br />
                <span className="text-burnished">Let&apos;s Talk.</span>
              </h2>

              <p className="mt-8 font-body text-stone text-base leading-relaxed max-w-md">
                Tell us what you need and we&apos;ll figure out the best way to build it.
                Every project starts with a conversation.
              </p>

              {/* Contact details */}
              <div className="mt-12 space-y-4">
                <a
                  href="tel:+12263430035"
                  className="block font-body text-sm text-stone hover:text-burnished transition-colors focus-gold"
                >
                  (226) 343-0035
                </a>
                <a
                  href="mailto:kaiden@satinfabrication.ca"
                  className="block font-body text-sm text-stone hover:text-burnished transition-colors focus-gold"
                >
                  kaiden@satinfabrication.ca
                </a>
              </div>
            </div>
          </MotionWrapper>

          {/* Right column — form or success */}
          <MotionWrapper delay={0.15}>
            {isSubmitted ? (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="flex flex-col items-center justify-center py-20 bg-obsidian/50 rounded-sm border border-slate/30"
              >
                <h3 className="font-display text-3xl text-burnished font-semibold">Thank You</h3>
                <p className="mt-4 font-body text-stone text-sm text-center max-w-xs">
                  We&apos;ll be in touch within 24 hours to discuss your project.
                </p>
              </m.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-8 bg-obsidian/50 rounded-sm border border-slate/30 p-8 lg:p-10"
              >
                {/* Name */}
                <div>
                  <label className="block font-body text-[10px] tracking-[0.3em] uppercase text-stone mb-3">
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="John Smith"
                    aria-label="Your name"
                    className="input-luxury w-full bg-transparent py-3 text-ivory placeholder:text-slate font-body text-sm"
                  />
                  {errors.name && (
                    <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.3em] uppercase text-stone mb-3">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="john@example.com"
                      aria-label="Email address"
                      className="input-luxury w-full bg-transparent py-3 text-ivory placeholder:text-slate font-body text-sm"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.3em] uppercase text-stone mb-3">
                      Phone
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="(555) 000-0000"
                      aria-label="Phone number"
                      className="input-luxury w-full bg-transparent py-3 text-ivory placeholder:text-slate font-body text-sm"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block font-body text-[10px] tracking-[0.3em] uppercase text-stone mb-3">
                    Project Type
                  </label>
                  <div className="relative">
                    <select
                      {...register('projectType')}
                      aria-label="Project type"
                      className="input-luxury w-full bg-transparent py-3 text-ivory font-body text-sm appearance-none focus-gold"
                      defaultValue=""
                    >
                      <option value="" disabled className="bg-void text-stone">
                        What do you need?
                      </option>
                      <option value="New Fabrication" className="bg-void text-ivory">
                        New Fabrication
                      </option>
                      <option value="Repair / Modification" className="bg-void text-ivory">
                        Repair / Modification
                      </option>
                      <option value="Design Help Needed" className="bg-void text-ivory">
                        Design Help Needed
                      </option>
                      <option value="Other" className="bg-void text-ivory">
                        Other
                      </option>
                    </select>
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone"
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
                    <p className="mt-2 text-xs text-red-600">{errors.projectType.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block font-body text-[10px] tracking-[0.3em] uppercase text-stone mb-3">
                    Project Details
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Tell us what you need built, repaired, or modified..."
                    aria-label="Project description"
                    rows={4}
                    className="input-luxury w-full bg-transparent py-3 text-ivory placeholder:text-slate font-body text-sm resize-none"
                  />
                  {errors.description && (
                    <p className="mt-2 text-xs text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 btn-primary font-body text-xs tracking-[0.3em] uppercase focus-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submitError && (
                  <p className="mt-2 text-xs text-red-600 text-center" role="alert">
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
