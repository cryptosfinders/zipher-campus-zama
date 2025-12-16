'use client'

import { useEffect, useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import TextareaAutosize from 'react-textarea-autosize'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useEthereumAccount } from '@/hooks/use-ethereum-account'

type GroupNameEditorProps = {
  groupId: Id<'groups'>
  name: string
}

export function GroupNameEditor({ groupId, name }: GroupNameEditorProps) {
  const { address } = useEthereumAccount()
  const updateName = useMutation(api.groups.updateName)

  const [value, setValue] = useState(name)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setValue(name)
  }, [name])

  const commitChange = async (nextValue: string) => {
    if (!address) return

    const sanitizedName = nextValue.trim() || 'Untitled group'
    setValue(sanitizedName)

    await updateName({
      id: groupId,
      name: sanitizedName,
      ownerAddress: address
    })
  }

  return (
    <div className="relative">
      {isEditing ? (
        <TextareaAutosize
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => {
            setIsEditing(false)
            void commitChange(value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              inputRef.current?.blur()
            }
          }}
          className="
            w-full resize-none bg-transparent
            text-4xl font-semibold tracking-tight
            outline-none
            text-foreground
            rounded-lg px-1 py-0.5
            ring-1 ring-transparent
            focus:ring-primary/40 focus:bg-primary/5
            transition-all
          "
          maxLength={80}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsEditing(true)
            requestAnimationFrame(() => inputRef.current?.focus())
          }}
          className="
            w-full text-left
            text-4xl font-semibold tracking-tight
            text-foreground
            transition-all
            hover:text-primary
            hover:opacity-90
          "
        >
          {value}
        </button>
      )}
    </div>
  )
}
