import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export const Logo = ({ className }: LogoProps) => (
  <span
    className={cn(
      'select-none font-semibold tracking-tight',
      'text-xl sm:text-2xl flex items-center gap-1.5',
      className
    )}
  >
    {/* Zipher */}
    <span className="text-foreground font-bold">Zipher</span>

    {/* Campus – gold accent */}
    <span className="text-primary font-semibold">Campus</span>
  </span>
)
