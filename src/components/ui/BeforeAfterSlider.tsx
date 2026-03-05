'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  className?: string
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, x)))
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Only update when pointer button is pressed (drag in progress)
      if (e.buttons > 0 || e.pressure > 0) {
        updatePosition(e.clientX)
      }
    },
    [updatePosition]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setPosition((prev) => Math.max(0, prev - 5))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setPosition((prev) => Math.min(100, prev + 5))
      }
    },
    []
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-[16/10] select-none overflow-hidden touch-none',
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
    >
      {/* Before image — full width, always visible */}
      <Image
        src={beforeSrc}
        alt={beforeAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* After image — clipped from left based on position */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Drag handle — vertical gold line at position */}
      <div
        className="absolute top-0 h-full w-0.5 bg-gold"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        {/* Circular knob at vertical center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold bg-void/80">
          <span className="text-gold text-xs select-none" aria-hidden="true">
            &#9664;&#9654;
          </span>
        </div>
      </div>
    </div>
  )
}
