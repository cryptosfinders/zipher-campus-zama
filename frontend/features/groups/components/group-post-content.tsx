'use client'

import { cn } from '@/lib/utils'

type GroupPostContentProps = {
  content?: string | null
  className?: string
}

/* ------------------ TEXT PARSER ------------------ */
function gatherText(node: unknown): string {
  if (!node) return ''

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (typeof node !== 'object') return ''

  const record = node as Record<string, unknown>
  const parts: string[] = []

  if (typeof record.text === 'string') {
    parts.push(record.text)
  }

  if (Array.isArray(record.content)) {
    for (const child of record.content) {
      const childText = gatherText(child)
      if (childText) parts.push(childText)
    }
  }

  if (Array.isArray(record.children)) {
    for (const child of record.children) {
      const childText = gatherText(child)
      if (childText) parts.push(childText)
    }
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function toPlainText(raw: string | null | undefined): string {
  if (!raw) return ''

  const trimmed = raw.trim()
  if (!trimmed) return ''

  try {
    const parsed = JSON.parse(trimmed)
    const blocks = Array.isArray(parsed) ? parsed : [parsed]

    const lines = blocks
      .map(block => gatherText(block).trim())
      .filter(Boolean)

    if (lines.length) {
      return lines.join('\n\n')
    }
  } catch {
    // fallback to raw text
  }

  return trimmed
}

/* ------------------ URL AUTO-LINK ------------------ */
function enhanceText(text: string) {
  const urlRegex =
    /(https?:\/\/[^\s]+)/g

  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4 break-words hover:text-primary/80"
        >
          {part}
        </a>
      )
    }

    return <span key={index}>{part}</span>
  })
}

/* ------------------ COMPONENT ------------------ */
export function GroupPostContent({ content, className }: GroupPostContentProps) {
  const text = toPlainText(content)
  if (!text.length) return null

  const lines = text.split('\n')

  return (
    <div
      className={cn(
        `
        whitespace-pre-line text-[15px] leading-7 text-foreground/95
        tracking-[0.01em] break-words 
        animate-fadeIn
        selection:bg-primary/20 selection:text-primary
      `,
        className
      )}
    >
      {lines.map((line, idx) => (
        <p key={idx} className="mb-3 last:mb-0 text-foreground">
          {enhanceText(line)}
        </p>
      ))}
    </div>
  )
}
