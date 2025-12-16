import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type LoadingIndicatorProps = {
  fullScreen?: boolean
}

export function LoadingIndicator({ fullScreen = false }: LoadingIndicatorProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center animate-fade-in',
        fullScreen ? 'min-h-[60vh] px-4 py-24' : 'h-24 px-4'
      )}
    >
      <div className="relative flex items-center justify-center">
        
        {/* Zipher Gold Glow */}
        <div className="absolute h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(255,215,130,0.25)_0%,transparent_70%)] blur-xl" />

        {/* Spinner */}
        <Loader2
          className="relative h-12 w-12 animate-spin text-primary duration-700"
          aria-hidden="true"
        />
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  )
}
