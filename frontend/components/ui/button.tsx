import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// Zipher Campus button styling
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        // Primary → Zipher Gold
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',

        // Red destructive (unchanged but polished)
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/85',

        // Outline → Gold border, soft gold hover
        outline:
          'border border-primary/40 text-foreground bg-transparent hover:bg-primary/10',

        // Secondary → Gray neutral (good for low emphasis)
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',

        // Ghost → Super lightweight gold hover
        ghost:
          'text-foreground hover:bg-primary/10',

        // Link → On-brand accent link
        link:
          'text-primary underline-offset-4 hover:underline'
      },

      size: {
        default: 'h-11 px-6 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10'
      }
    },

    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
