// frontend/providers/app-providers.tsx
'use client'

import { ReactNode } from 'react'
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes'

// Required for Wagmi v2
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Convex + Wallet Providers
import { ConvexClientProvider } from '@/providers/convex-client-provider'
import { WalletProvider } from '@/lib/web3/WalletProvider'
import { EthereumAccountProvider } from '@/hooks/use-ethereum-account'

// Wagmi wrapper (client boundary)
import { WagmiClientWrapper } from '@/providers/wagmi-client-wrapper'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const queryClient = new QueryClient()

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <WagmiClientWrapper>
          <EthereumAccountProvider>
            <WalletProvider>
              <ConvexClientProvider>
                <ThemeAwareEthereumWrapper>
                  {children}
                </ThemeAwareEthereumWrapper>
              </ConvexClientProvider>
            </WalletProvider>
          </EthereumAccountProvider>
        </WagmiClientWrapper>
      </QueryClientProvider>
    </NextThemeProvider>
  )
}

/* ---------------------------------------------------------------------
   Theme Wrapper (unchanged — NO UI modifications)
------------------------------------------------------------------------ */
function ThemeAwareEthereumWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()

  const brandVars = {
    '--pw-core-accent-color': '#F5B700',
    '--pw-core-accent-hover': '#FF6A00',
    '--pw-core-text-primary': '#F8F8F8',
    '--pw-core-text-secondary': '#dcdcdc',
    '--pw-core-border-color': '#F5B700',
    '--pw-core-radius': '16px',
  }

  const themeLight = {
    '--pw-core-bg-primary-color': '#F8F8F8',
    '--pw-core-bg-secondary-color': '#ffffff',
    ...brandVars,
  }

  const themeDark = {
    '--pw-core-bg-primary-color': '#0A0A0A',
    '--pw-core-bg-secondary-color': '#1A1A1A',
    ...brandVars,
  }

  const activeTheme =
    resolvedTheme === 'dark' ? themeDark : themeLight

  return (
    <div style={activeTheme as React.CSSProperties}>
      {children}
    </div>
  )
}

