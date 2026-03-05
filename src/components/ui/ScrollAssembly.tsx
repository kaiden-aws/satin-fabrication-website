'use client'

import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface AssemblyPiece {
  id: string
  label: string
  initialX: number
  initialY: number
  initialRotate: number
}

interface ScrollAssemblyProps {
  pieces: AssemblyPiece[]
  className?: string
}

/**
 * Renders decorative "piece" shapes that start scattered and converge
 * to an assembled (centered) position as the user scrolls.
 *
 * The pieces array with specific initialX/Y/rotate values is configured
 * by the consumer — the component itself is generic.
 */
export function ScrollAssembly({ pieces, className }: ScrollAssemblyProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  })

  return (
    <div ref={containerRef} className={cn('min-h-[150vh]', className)}>
      {/* Sticky wrapper keeps assembly centered in viewport while scrolling */}
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="relative h-80 w-80">
          {pieces.map((piece) => (
            <AssemblyPieceElement
              key={piece.id}
              piece={piece}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Individual animated piece — extracted so that useTransform hooks
 * are called unconditionally per piece (React rules of hooks).
 */
function AssemblyPieceElement({
  piece,
  scrollYProgress,
}: {
  piece: AssemblyPiece
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const x = useTransform(scrollYProgress, [0, 0.8], [piece.initialX, 0])
  const y = useTransform(scrollYProgress, [0, 0.8], [piece.initialY, 0])
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.8],
    [piece.initialRotate, 0]
  )
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.3, 1])

  // Vary piece sizes to represent different metal parts
  const sizeVariants = [
    'h-20 w-32',
    'h-28 w-16',
    'h-14 w-14',
    'h-16 w-40',
    'h-12 w-24',
  ]
  const index = Math.abs(piece.initialX + piece.initialY) % sizeVariants.length
  const sizeClass = sizeVariants[index]

  return (
    <m.div
      className={cn(
        'absolute left-1/2 top-1/2 flex items-center justify-center rounded border border-gold/30 bg-charcoal',
        sizeClass
      )}
      style={{ x, y, rotate, opacity }}
    >
      <span className="font-body text-xs text-warm-gray select-none">
        {piece.label}
      </span>
    </m.div>
  )
}
