// app/layout.tsx
import { Inter } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"

import NextTopLoader from "nextjs-toploader"
import { Toaster } from "sonner"

import { AppNavbar } from "@/components/layout/app-navbar"
import { AppProviders } from "@/providers/app-providers"

export const dynamic = "force-dynamic";

// ❌ REMOVE: WalletProvider import
// import { WalletProvider } from "@/lib/web3/WalletProvider";

const inter = Inter({ subsets: ["latin"], preload: false })

export const metadata: Metadata = {
  title: "Zipher Campus",
  description: "FH-EVM powered membership dApp",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ⭐ WagmiProvider + WalletProvider now live INSIDE AppProviders */}
        <AppProviders>
          <NextTopLoader
            showSpinner={false}
            height={3}
            color="#D4AF37" // Zipher Gold
            crawl={false}
          />

          <div className="flex min-h-screen flex-col">
            <AppNavbar />
            <main className="flex-1">{children}</main>
          </div>

          <Toaster />
        </AppProviders>
      </body>
    </html>
  )
}
