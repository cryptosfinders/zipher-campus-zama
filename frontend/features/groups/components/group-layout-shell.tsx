'use client'

import type { ReactNode } from 'react'
import type { Id } from '@/convex/_generated/dataModel'

import { GroupNavTabs } from './group-nav-tabs'
import { GroupSidebar } from './group-sidebar'
import { GroupSubscriptionBanner } from './group-subscription-banner'
import { GroupProvider } from '../context/group-context'

type GroupLayoutShellProps = {
  groupId: Id<'groups'>
  children: ReactNode
  hideSidebar?: boolean
}

export function GroupLayoutShell({
  groupId,
  children,
  hideSidebar = false,
}: GroupLayoutShellProps) {
  return (
    <GroupProvider groupId={groupId}>
      <div className="flex min-h-screen flex-col bg-background">

        {/* Top Navigation */}
        <GroupNavTabs />

        {/* Subscription Reminder */}
        <GroupSubscriptionBanner />

        {/* Page Container */}
        <div className="mx-auto w-full max-w-7xl px-6 py-8">

          {hideSidebar ? (
            // For pages like /settings or /create
            <section className="w-full min-w-0">{children}</section>
          ) : (
            // Standard two-column layout
            <div className="flex gap-8">

              {/* Main Content */}
              <section className="flex-1 min-w-0">
                {children}
              </section>

              {/* Sidebar (Desktop Only) */}
              <aside className="hidden lg:block sticky top-28 h-fit w-72">
                <GroupSidebar />
              </aside>

            </div>
          )}

        </div>
      </div>
    </GroupProvider>
  )
}
