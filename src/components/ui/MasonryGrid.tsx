import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MasonryGridProps {
  children: ReactNode
  className?: string
}

export function MasonryGrid({ children, className }: MasonryGridProps) {
  return (
    <div className={cn('columns-1 sm:columns-2 lg:columns-3 gap-4', className)}>
      {children}
    </div>
  )
}

interface MasonryItemProps {
  children: ReactNode
  className?: string
}

export function MasonryItem({ children, className }: MasonryItemProps) {
  return (
    <div className={cn('break-inside-avoid mb-4', className)}>
      {children}
    </div>
  )
}
