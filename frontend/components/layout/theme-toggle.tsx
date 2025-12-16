'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

const gold = '#D4AF37' // Zipher Campus Gold

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const Icon = isDark ? Sun : Moon

  const label = mounted
    ? `Switch to ${isDark ? 'light' : 'dark'} mode`
    : 'Toggle theme'

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      aria-label={label}
      title={label}
      onClick={handleToggle}
      className='rounded-full border border-transparent hover:border-[#D4AF37] transition-colors'
      style={{
        color: gold,
        boxShadow: isDark
          ? `0 0 8px rgba(212, 175, 55, 0.5)`
          : `0 0 5px rgba(212, 175, 55, 0.25)`
      }}
    >
      {mounted ? (
        <Icon className='h-4 w-4' style={{ color: gold }} />
      ) : (
        <div className='h-4 w-4' />
      )}
    </Button>
  )
}
