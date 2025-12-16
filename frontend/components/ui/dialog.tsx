'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// --- Overlay (Zipher Glass Layer) ---
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      `
        fixed inset-0 z-50 
        backdrop-blur-sm bg-black/60

        data-[state=open]:animate-in
        data-[state=closed]:animate-out

        data-[state=open]:fade-in-0
        data-[state=closed]:fade-out-0
      `,
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// --- Content Panel (Zipher Modal Style) ---
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />

    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        `
          fixed left-1/2 top-1/2 z-50
          w-full max-w-xl 
          -translate-x-1/2 -translate-y-1/2

          rounded-2xl border border-border/40 
          bg-card shadow-xl

          p-6 sm:p-8
          grid gap-6

          transition-all duration-200

          data-[state=open]:animate-in
          data-[state=closed]:animate-out

          data-[state=open]:zoom-in-90
          data-[state=closed]:zoom-out-90

          data-[state=open]:fade-in-0
          data-[state=closed]:fade-out-0
        `,
        className
      )}
      {...props}
    >
      {children}

      {/* Zipher Close Button */}
      <DialogPrimitive.Close
        className="
          absolute right-5 top-5
          rounded-full p-1.5
          bg-secondary hover:bg-secondary/80
          transition

          text-muted-foreground hover:text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/40
        "
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// --- Header ---
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-2 text-left', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

// --- Footer ---
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

// --- Title ---
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      `
        text-xl font-semibold tracking-tight 
        text-foreground
      `,
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// --- Description ---
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      `
        text-sm leading-relaxed 
        text-muted-foreground
      `,
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
}
