'use client';

import { useState } from 'react';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/lib/web3/WalletProvider';
import { useChainInfo } from '@/lib/web3/useChainInfo';
import { shortenAddress } from '@/lib/shortenAddress';

export function WalletMenu() {
  const { address, connect, disconnect, balance } = useWallet();
  const { chainName } = useChainInfo();
  const [open, setOpen] = useState(false);

  if (!address) {
    return (
      <button
        onClick={() => connect()} // <-- THIS triggers MetaMask popup!
        className="
          px-4 py-2 rounded-lg
          bg-primary text-black font-semibold
          hover:opacity-90 transition
        "
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2
          px-4 py-2 rounded-lg
          bg-card/40 backdrop-blur
          border border-border/40
          hover:border-primary/50
          transition
        "
      >
        <Wallet className="h-4 w-4 text-primary" />
        <span className="font-medium">{shortenAddress(address)}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-48
            rounded-lg border border-border/40
            bg-card/80 backdrop-blur-xl shadow-xl p-2
          "
        >
          <div className="px-3 py-2 text-sm text-muted-foreground">
            <span className="block">Network:</span>
            <span className="text-primary font-semibold">{chainName}</span>
          </div>

          <div className="px-3 py-2 text-sm text-muted-foreground">
            <span className="block">Balance:</span>
            <span className="text-white font-semibold">{balance} ETH</span>
          </div>

          <button
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="
              flex items-center gap-2
              w-full px-3 py-2 mt-2 rounded-md
              hover:bg-primary/10 hover:text-primary transition
            "
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
