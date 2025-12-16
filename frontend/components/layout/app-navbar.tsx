'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { GroupSwitcher } from './group-switcher';
import { ThemeToggle } from './theme-toggle';

import { WalletMenu } from '@/components/web3/WalletMenu';

export function AppNavbar() {
  const pathname = usePathname();
  const isMarketplace = pathname?.startsWith('/marketplace');
  const isMemberships = pathname?.startsWith('/memberships');

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-card/70">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-6 px-6">

        {/* LEFT SIDE — Logo + switcher + nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="hidden items-center sm:flex">
            <Image
              src="/images/zipher-campus-logo.png"
              alt="Zipher Campus"
              width={292}
              height={293}
              priority
              className="h-9 w-auto"
            />
            <span className="sr-only">Zipher Campus</span>
          </Link>

          <GroupSwitcher />

          <nav className="flex items-center gap-1">
            <Link
              href="/marketplace"
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md
                ${
                  isMarketplace
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }
              `}
            >
              Marketplace
            </Link>

            <Link
              href="/memberships"
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md
                ${
                  isMemberships
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }
              `}
            >
              My memberships
            </Link>
          </nav>
        </div>

        {/* RIGHT SIDE — Theme + Wallet */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* 🔥 Replace old broken MetaMask logic with WalletMenu */}
          <WalletMenu />
        </div>
      </div>
    </header>
  );
}
