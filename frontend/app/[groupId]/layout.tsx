// frontend/app/[groupId]/layout.tsx
import type { ReactNode } from "react"
import { GroupLayoutShell } from "@/features/groups/components/group-layout-shell"
import type { Id } from "@/convex/_generated/dataModel"

type GroupLayoutProps = {
  children: ReactNode
  params: Promise<{
    groupId: string
  }>
}

export default async function GroupLayout({
  children,
  params,
}: GroupLayoutProps) {
  const { groupId } = await params

  return (
    <GroupLayoutShell groupId={groupId as Id<"groups">}>
      {children}
    </GroupLayoutShell>
  )
}
