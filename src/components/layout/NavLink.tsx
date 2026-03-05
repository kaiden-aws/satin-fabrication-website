import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  label: string
  className?: string
}

export function NavLink({ href, label, className }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'relative font-body text-sm uppercase tracking-widest text-cream',
        'transition-colors duration-300 hover:text-gold',
        'group focus-gold',
        className
      )}
    >
      {label}
      <span className="absolute bottom-0 left-0 h-[1px] w-full bg-gold origin-left scale-x-0 transition-transform duration-300 ease-luxury group-hover:scale-x-100" />
    </a>
  )
}
