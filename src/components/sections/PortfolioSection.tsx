'use client'

import Image from 'next/image'
import { MasonryGrid, MasonryItem } from '@/components/ui/MasonryGrid'
import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { PORTFOLIO_PROJECTS } from '@/lib/constants'

export function PortfolioSection() {
  return (
    <section id="work" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <MotionWrapper>
          <h2 className="font-display text-4xl md:text-5xl text-cream text-center mb-16">
            OUR <span className="text-gold">WORK</span>
          </h2>
        </MotionWrapper>

        <MotionWrapper>
          <MasonryGrid>
            {PORTFOLIO_PROJECTS.map((project) => (
              <MasonryItem key={project.title}>
                <div className="group relative overflow-hidden rounded">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={project.width}
                    height={project.height}
                    className="w-full block"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                    <span className="font-display text-lg text-cream">
                      {project.title}
                    </span>
                    <span className="font-body text-sm text-gold">
                      {project.category}
                    </span>
                  </div>
                </div>
              </MasonryItem>
            ))}
          </MasonryGrid>
        </MotionWrapper>
      </div>
    </section>
  )
}
