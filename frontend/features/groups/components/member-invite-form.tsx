'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useEthereumAccount } from '@/hooks/use-ethereum-account'

/* Zipher Campus Color Tokens */
const ZIPHER_GOLD = '#F7C948'
const ZIPHER_GOLD_BORDER = 'rgba(247, 201, 72, 0.45)'

type MemberInviteFormProps = {
  groupId: Id<'groups'>
}

export function MemberInviteForm({ groupId }: MemberInviteFormProps) {
  const [value, setValue] = useState('')
  const { address } = useEthereumAccount()
  const { mutate, pending } = useApiMutation(api.users.addToGroup)

  const handleInvite = async () => {
    if (!address) {
      toast.error('Connect your wallet to invite members.')
      return
    }

    if (!value.trim()) {
      toast.error('Enter a valid wallet address.')
      return
    }

    try {
      await mutate({
        groupId,
        ownerAddress: address,
        memberAddress: value.trim()
      })
      toast.success('Invitation sent!')
      setValue('')
    } catch (error) {
      console.error(error)
      toast.error('Unable to add member. Please try again.')
    }
  }

  return (
    <div
      className="
        rounded-2xl border p-6 transition-all
        bg-white/60 backdrop-blur-md shadow-sm
      "
      style={{
        borderColor: ZIPHER_GOLD_BORDER,
      }}
    >
      <p className="text-sm text-neutral-600 font-medium">
        Invite a member by wallet address
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="0xabc..."
          value={value}
          onChange={event => setValue(event.target.value)}
          disabled={pending}
          className="
            rounded-xl border px-4 py-2 text-black
            focus-visible:ring-2 focus-visible:ring-offset-0
          "
          style={{
            borderColor: ZIPHER_GOLD_BORDER,
            backgroundColor: '#fff',
            boxShadow: '0 0 0 0 transparent',
          }}
        />

        <Button
          type="button"
          onClick={handleInvite}
          disabled={pending}
          className="
            rounded-xl font-semibold uppercase px-6 py-2
            hover:opacity-90 active:scale-[0.98]
            transition-all shadow-sm
          "
          style={{
            backgroundColor: ZIPHER_GOLD,
            color: '#000',
          }}
        >
          {pending ? 'Adding...' : 'Add Member'}
        </Button>
      </div>
    </div>
  )
}
