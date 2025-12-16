import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          `
          flex w-full h-11
          rounded-xl
          bg-input 
          px-4 py-3
          text-sm text-foreground
          placeholder:text-muted-foreground/70

          border border-border/50
          shadow-xs

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
          focus-visible:ring-offset-0

          transition-all duration-150
          disabled:cursor-not-allowed disabled:opacity-50
          `,
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
