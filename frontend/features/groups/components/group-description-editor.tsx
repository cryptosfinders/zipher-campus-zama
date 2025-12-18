'use client'

import { useCallback, useEffect, useState } from 'react'

import { useCreateBlockNote } from "@blocknote/react";
import BlockNoteEditor from "@/components/blocknote-client";
import { useMutation } from 'convex/react'
import { AlertOctagon } from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useWallet } from '@/lib/web3/WalletProvider'

type GroupDescriptionEditorProps = {
  groupId: Id<'groups'>
  initialContent?: string
  editable?: boolean
  className?: string
}

const MAX_LENGTH = 40_000

function parseContent(raw?: string) {
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Failed to parse group description', error)
    return undefined
  }
}

export function GroupDescriptionEditor({
  groupId,
  initialContent,
  editable = false,
  className
}: GroupDescriptionEditorProps) {
  const { address } = useWallet()
  const updateDescription = useMutation(api.groups.updateDescription)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const editor = useCreateBlockNote({
    initialContent: parseContent(initialContent)
  })

  const handlePersist = useCallback(() => {
    if (!editable) return
    if (!address) return
    if (!editor.document) return

    const serialized = JSON.stringify(editor.document, null, 2)

    if (serialized.length > MAX_LENGTH) {
      toast.error('Description is too long. Not saved.', {
        duration: 2000,
        icon: <AlertOctagon />
      })
      return
    }

    updateDescription({
      id: groupId,
      description: serialized,
      ownerAddress: address
    }).catch(() => {
      toast.error('Unable to save changes. Please retry.')
    })
  }, [address, editable, editor.document, groupId, updateDescription])

  useEffect(() => {
    setMounted(true)
  }, [])

  const blocknoteTheme =
    mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <BlockNoteEditor 
      editor={editor}
      editable={editable}
      theme={blocknoteTheme}
      onChange={handlePersist}
      className={className}
    />
  )
}
