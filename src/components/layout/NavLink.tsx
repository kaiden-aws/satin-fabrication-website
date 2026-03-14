import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  label: string
  scrolled?: boolean
  className?: string
}

export function NavLink({ href, label, scrolled, className }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'relative font-body text-[11px] uppercase tracking-[0.2em]',
        'transition-colors duration-400',
        'group focus-gold',
        scrolled
          ? 'text-stone hover:text-burnished'
          : 'text-white/90 hover:text-white',
        className
      )}
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-full bg-burnished origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
    </a>
  )
}
