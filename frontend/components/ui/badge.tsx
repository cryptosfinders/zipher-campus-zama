import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Zipher Campus Brand Badge Variants
const badgeVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0',
  {
    variants: {
      variant: {
        // Gold premium badge
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',

        // Active (reverse contrast)
        active:
          'bg-foreground text-background shadow-sm hover:bg-foreground/90',

        // Soft gold outline
        outline:
          'border border-primary/40 text-foreground bg-transparent hover:bg-primary/10',

        // Subtle hover for low-emphasis badges
        ghost:
          'text-foreground hover:bg-primary/10'
      },

      size: {
        default: 'h-8 px-4 text-sm',
        sm: 'h-7 px-3 text-xs',
        lg: 'h-9 px-5 text-base'
      }
    },

    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { badgeVariants }
