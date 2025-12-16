'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { useGroupContext } from '../context/group-context'

const TABS = [
  { label: 'About', suffix: '/about', key: 'about' as const },
  { label: 'Feed', suffix: '/feed', key: 'feed' as const },
  { label: 'Classroom', suffix: '/classroom', key: 'classroom' as const },
  { label: 'Members', suffix: '/members', key: 'members' as const }
]

export function GroupNavTabs() {
  const pathname = usePathname()
  const params = useParams()
  const groupId = typeof params?.groupId === 'string' ? params.groupId : ''
  const { access } = useGroupContext()

  if (!groupId) return null

  return (
    <nav className="backdrop-blur-xl border-b border-border/40 bg-background/60 sticky top-0 z-30">
      <ul className="mx-auto flex max-w-6xl items-center gap-2 px-4 sm:px-6">
        {TABS.filter(tab => access[tab.key]).map(tab => {
          const href = `/${groupId}${tab.suffix}`
          const isActive =
            pathname === href ||
            (tab.suffix && pathname?.startsWith(`${href}/`)) ||
            (tab.key === 'about' &&
              (pathname === `/${groupId}` || pathname === `/${groupId}/`))

          return (
            <li key={tab.key}>
              <Link
                href={href}
                className={cn(
                  'relative inline-flex items-center px-4 sm:px-5 py-4 text-sm font-medium transition-all duration-200',
                  'hover:text-foreground/90 text-muted-foreground',
                  isActive && 'text-primary'
                )}
              >
                {tab.label}

                {/* Animated underline */}
                {isActive && (
                  <span
                    className="
                      absolute inset-x-2 -bottom-[2px] h-[2px]
                      bg-primary rounded-full
                      shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]
                      transition-all duration-200
                    "
                  />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
