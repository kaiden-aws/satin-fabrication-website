'use client'

import { useEffect, useRef, useCallback } from 'react'
import { CURSOR_LERP_SPEED } from '@/lib/constants'

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor="pointer"], [data-cursor="view"]'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const isHoveringRef = useRef(false)

  const animate = useCallback(() => {
    posRef.current.x = lerp(posRef.current.x, targetRef.current.x, CURSOR_LERP_SPEED)
    posRef.current.y = lerp(posRef.current.y, targetRef.current.y, CURSOR_LERP_SPEED)

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(INTERACTIVE_SELECTOR)) {
        if (!isHoveringRef.current) {
          isHoveringRef.current = true
          cursorRef.current?.classList.add('cursor-expanded')
        }
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(INTERACTIVE_SELECTOR)) {
        if (isHoveringRef.current) {
          isHoveringRef.current = false
          cursorRef.current?.classList.remove('cursor-expanded')
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999]"
      aria-hidden="true"
    />
  )
}
