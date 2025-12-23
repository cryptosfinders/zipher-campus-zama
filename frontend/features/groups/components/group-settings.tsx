'use client'

import { Switch } from '@/components/ui/switch'

type GroupSettingsProps = {
  group: {
    _id: string
    isListed: boolean
  }
  updateGroup: (args: { id: string; isListed: boolean }) => void
}

export function GroupSettings({
  group,
  updateGroup
}: GroupSettingsProps) {
  return (
    <>
      <Switch
        checked={group.isListed}
        onCheckedChange={(v) =>
          updateGroup({ id: group._id, isListed: v })
        }
      />
      <span>List this space in marketplace</span>
    </>
  )
}

