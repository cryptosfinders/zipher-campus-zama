'use client'

import { ElementRef, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'

interface NameEditorProps {
  id: Id<'modules'>
  name: string
  ownerAddress?: string | null
}

export const ModuleNameEditor = ({
  id,
  name,
  ownerAddress
}: NameEditorProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(name)

  const update = useMutation(api.modules.updateTitle)

  const enableInput = () => {
    setIsEditing(true)
    setTimeout(() => {
      setValue(name)
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(
        value.length,
        value.length
      )
    }, 0)
  }

  const disableEditing = () => setIsEditing(false)

  const commitChange = (text: string) => {
    if (!ownerAddress) return
    update({
      id,
      title: text.trim() || 'Untitled',
      address: ownerAddress
    })
  }

  const onChange = (text: string) => {
    setValue(text)
  }

  const onBlur = () => {
    disableEditing()
    commitChange(value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      disableEditing()
      commitChange(value)
    }
  }

  return (
    <div className="w-full">
      {isEditing ? (
        <TextareaAutosize
          ref={inputRef}
          value={value}
          onBlur={onBlur}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className={cn(
            'w-full resize-none text-center',
            'bg-transparent outline-none',
            'font-semibold text-foreground text-sm',
            'px-2 py-1 rounded-lg',
            'border border-border/40',
            'focus:ring-2 focus:ring-primary/40 focus:border-primary transition'
          )}
          maxLength={60}
        />
      ) : (
        <div
          onClick={enableInput}
          className={cn(
            'w-full px-2 py-1 text-sm font-semibold text-center text-foreground',
            'rounded-lg cursor-pointer select-none',
            'transition hover:bg-muted/50 hover:border-border/60',
            'border border-transparent'
          )}
        >
          {name || 'Untitled'}
        </div>
      )}
    </div>
  )
}

