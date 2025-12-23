'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, LogOut, Wallet, RefreshCw } from 'lucide-react';
import { useWallet } from '@/lib/web3/WalletProvider';
import { shortenAddress } from '@/lib/utils';
import { switchChain } from '@/lib/onchain/wallet';

import { Button } from '@/components/ui/button';

const CHAINS = {
  11155111: { name: 'Sepolia', id: 11155111 },
  31337: { name: 'Localhost', id: 31337 },
  10901: { name: 'Zama FH-EVM', id: 10901 }
};

export function WalletMenu() {
  const {
    address,
    chainId,
    connect,
    disconnect,
    walletClient
  } = useWallet();

  const [open, setOpen] = useState(false);

  async function handleSwitch(chain: number) {
    try {
      await switchChain(chain);
    } catch (err) {
      console.error('switch failed', err);
    }
  }

  return (
    <div className="relative">
      {address ? (
        <>
          {/* Connected View */}
          <button
            onClick={() => setOpen(!open)}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg 
              bg-primary/10 border border-primary/40 
              text-primary font-semibold hover:bg-primary/20 transition
            "
          >
            <Wallet className="h-4 w-4" />
            <span>{shortenAddress(address)}</span>
            <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div
              className="
                absolute right-0 mt-2 w-56 rounded-xl 
                border border-border/40 bg-card/90 backdrop-blur-xl shadow-xl 
                p-3 space-y-3 z-50
              "
            >
              {/* Wallet Connected */}
              <div className="text-sm font-medium text-muted-foreground">
  Wallet connected
</div>

              {/* Chain */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Network
                </p>

                <select
                  className="
                    w-full text-sm px-3 py-2 rounded-lg 
                    bg-primary/10 text-primary border border-primary/40
                  "
                  value={chainId ?? ''}
                  onChange={(e) => handleSwitch(Number(e.target.value))}
                >
                  <option disabled value="">
                    Select network…
                  </option>

                  {Object.values(CHAINS).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disconnect */}
              <button
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
                className="
                  flex items-center gap-2 w-full px-3 py-2 rounded-lg 
                  bg-red-500/10 text-red-500 border border-red-500/40
                  hover:bg-red-500/20 transition text-sm font-semibold
                "
              >
                <LogOut className="h-4 w-4" /> Disconnect
              </button>
            </div>
          )}
        </>
      ) : (
        /* Not Connected View */
        <Button
          onClick={connect}
          className="
            bg-primary text-white hover:bg-primary/90 
            font-semibold px-4 py-2 rounded-lg
          "
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
