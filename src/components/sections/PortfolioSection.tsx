'use client'

import Image from 'next/image'
import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { PORTFOLIO_PROJECTS } from '@/lib/constants'

export function PortfolioSection() {
  return (
    <section id="work" className="py-32 px-8 md:px-16 lg:px-24 bg-obsidian/50">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <MotionWrapper>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-burnished/40" />
                <span className="font-body text-xs tracking-[0.4em] uppercase text-stone">
                  Selected Work
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-ivory leading-[0.9]">
                Our
                <span className="text-burnished"> Portfolio</span>
              </h2>
            </div>
            <p className="font-body text-stone text-sm max-w-sm leading-relaxed md:text-right">
              A sample of recent projects showing the range of what we build.
            </p>
          </div>
        </MotionWrapper>

        {/* Masonry grid — main items (excluding trailers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTFOLIO_PROJECTS.filter((_, i) => i < 5).map((project, i) => {
            const isLarge = i === 0 || i === 4
            return (
              <MotionWrapper key={project.title} delay={i * 0.05}>
                <div
                  className={`group relative overflow-hidden rounded-sm border border-slate/60 ${
                    isLarge ? 'sm:row-span-2' : ''
                  }`}
                  style={{ backgroundColor: '#f5f5f5' }}
                >
                  <div
                    className={`relative ${isLarge ? 'aspect-[3/4]' : 'aspect-[4/3]'} flex items-center justify-center p-6`}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} — ${project.description}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-500" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 [@media(hover:none)]:translate-y-0 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <span className="font-body text-[10px] tracking-[0.3em] uppercase text-blue-300 mb-2">
                        {project.category}
                      </span>
                      <span className="font-display text-xl text-white font-medium">
                        {project.title}
                      </span>
                      <span className="font-body text-xs text-white/70 mt-1">
                        {project.description}
                      </span>
                      <div className="mt-3 h-px w-8 bg-white/40" />
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            )
          })}
        </div>

        {/* Trailer pair — side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {PORTFOLIO_PROJECTS.filter((_, i) => i >= 5).map((project, i) => (
            <MotionWrapper key={project.title} delay={(5 + i) * 0.05}>
              <div
                className="group relative overflow-hidden rounded-sm border border-slate/60"
                style={{ backgroundColor: '#f5f5f5' }}
              >
                <div className="relative aspect-[4/3] flex items-center justify-center p-6">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.description}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain p-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 [@media(hover:none)]:translate-y-0 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-blue-300 mb-2">
                      {project.category}
                    </span>
                    <span className="font-display text-xl text-white font-medium">
                      {project.title}
                    </span>
                    <span className="font-body text-xs text-white/70 mt-1">
                      {project.description}
                    </span>
                    <div className="mt-3 h-px w-8 bg-white/40" />
                  </div>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
