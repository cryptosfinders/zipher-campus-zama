'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ──────────────────────────────────────────────── */
/* Root / Portal / Trigger                          */
/* ──────────────────────────────────────────────── */

const DropdownMenu = (props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => (
  <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
)

const DropdownMenuPortal = (
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>
) => <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />

const DropdownMenuTrigger = (
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>
) => <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />

/* ──────────────────────────────────────────────── */
/* Content — Zipher Campus Styling                  */
/* ──────────────────────────────────────────────── */

const DropdownMenuContent = ({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          `
          z-50 
          min-w-[8rem]
          overflow-hidden
          rounded-lg 
          border border-border/40
          bg-card/90 backdrop-blur-md

          shadow-xl shadow-black/5

          p-1

          data-[state=open]:animate-in
          data-[state=closed]:animate-out

          data-[state=open]:fade-in-0
          data-[state=closed]:fade-out-0

          data-[state=open]:zoom-in-95
          data-[state=closed]:zoom-out-95

          data-[side=bottom]:slide-in-from-top-1
          data-[side=top]:slide-in-from-bottom-1
          data-[side=left]:slide-in-from-right-1
          data-[side=right]:slide-in-from-left-1
        `,
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

/* ──────────────────────────────────────────────── */
/* Group / Label / Separator                        */
/* ──────────────────────────────────────────────── */

const DropdownMenuGroup = (
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>
) => <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) => (
  <DropdownMenuPrimitive.Label
    className={cn(
      `
      px-2 py-1.5 text-sm font-medium
      text-muted-foreground
      ${inset ? 'pl-8' : ''}
    `,
      className
    )}
    data-inset={inset}
    {...props}
  />
)

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator
    className={cn('mx-1 my-1 h-px bg-border/70', className)}
    {...props}
  />
)

/* ──────────────────────────────────────────────── */
/* Items (Default + Checkbox + Radio)               */
/* ──────────────────────────────────────────────── */

const DropdownMenuItem = ({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) => (
  <DropdownMenuPrimitive.Item
    data-slot="dropdown-menu-item"
    data-inset={inset}
    className={cn(
      `
      relative flex items-center gap-2
      px-2 py-1.5 text-sm rounded-md cursor-pointer select-none

      outline-none
      transition-colors

      hover:bg-primary/10
      focus:bg-primary/10

      text-foreground

      data-[variant=destructive]:text-destructive
      data-[variant=destructive]:hover:bg-destructive/10

      data-[inset]:pl-8

      data-[disabled]:pointer-events-none
      data-[disabled]:opacity-50

      [&_svg]:size-4 [&_svg]:shrink-0 text-muted-foreground
    `,
      className
    )}
    {...props}
  />
)

const DropdownMenuCheckboxItem = ({
  className,
  checked,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) => (
  <DropdownMenuPrimitive.CheckboxItem
    className={cn(
      `
      relative flex items-center gap-2
      pl-8 pr-2 py-1.5 
      text-sm rounded-md cursor-pointer select-none

      hover:bg-primary/10
      focus:bg-primary/10

      data-[disabled]:opacity-50
    `,
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
)

const DropdownMenuRadioGroup = (
  props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>
) => <DropdownMenuPrimitive.RadioGroup {...props} />

const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      `
      relative flex items-center gap-2
      pl-8 pr-2 py-1.5 
      text-sm rounded-md cursor-pointer

      hover:bg-primary/10
      focus:bg-primary/10
    `,
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CircleIcon className="size-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
)

/* ──────────────────────────────────────────────── */
/* Submenus                                         */
/* ──────────────────────────────────────────────── */

const DropdownMenuSub = (
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>
) => <DropdownMenuPrimitive.Sub {...props} />

const DropdownMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      `
      flex items-center gap-2
      px-2 py-1.5 
      text-sm rounded-md cursor-pointer

      hover:bg-primary/10
      focus:bg-primary/10

      data-[state=open]:bg-primary/10

      ${inset ? 'pl-8' : ''}
    `,
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
)

const DropdownMenuSubContent = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(
      `
      z-50 rounded-lg 
      border border-border/40
      bg-card/90 backdrop-blur-md 
      shadow-xl p-1

      data-[state=open]:animate-in
      data-[state=closed]:animate-out
    `,
      className
    )}
    {...props}
  />
)

/* ──────────────────────────────────────────────── */
/* Shortcut Text                                    */
/* ──────────────────────────────────────────────── */

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    className={cn(
      'ml-auto text-xs tracking-widest text-muted-foreground',
      className
    )}
    {...props}
  />
)

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
