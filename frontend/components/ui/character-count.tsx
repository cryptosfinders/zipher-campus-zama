import { cn } from '@/lib/utils'

type CharacterCountProps = {
  value?: string | null
  maxLength?: number
  className?: string
}

export function CharacterCount({
  value,
  maxLength,
  className
}: CharacterCountProps) {
  const length = value?.length ?? 0
  const limit = typeof maxLength === 'number' ? maxLength : null
  const nearLimit = limit !== null && length >= limit * 0.85 && length <= limit
  const overLimit = limit !== null && length > limit

  const text = limit !== null ? `${length}/${limit}` : `${length} characters`

  return (
    <span
      role='status'
      aria-live='polite'
      className={cn(
        'block text-right text-[11px] font-medium transition-colors',
        nearLimit && 'text-primary',          // Zipher gold when close to limit
        overLimit && 'text-destructive font-semibold',
        'text-muted-foreground',
        className
      )}
    >
      {text}
    </span>
  )
}
