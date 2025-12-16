'use client';

import { useEffect, useState } from 'react';
import { ZIPHER_CHAIN_ID } from '@/lib/config';

export type ChainInfo = {
  chainId: number | null;
  chainLabel: string;
  isSupported: boolean;
};

export function useChainInfo(): ChainInfo {
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const eth: any = (typeof window !== 'undefined' ? window.ethereum : null);
    if (!eth?.request) return;

    async function load() {
      try {
        const cidHex = await eth.request({ method: 'eth_chainId' });
        setChainId(parseInt(cidHex, 16));
      } catch {
        setChainId(null);
      }
    }

    load();

    // Listen for changes
    eth.on?.('chainChanged', (cid: string) => {
      setChainId(parseInt(cid, 16));
    });

    return () => {
      eth.removeListener?.('chainChanged', () => {});
    };
  }, []);

  let chainLabel = 'Unknown Chain';
  let isSupported = false;

  if (chainId === 11155111) {
    chainLabel = 'Ethereum Sepolia';
    isSupported = true;
  } else if (chainId === Number(ZIPHER_CHAIN_ID)) {
    chainLabel = 'Zama FH-EVM';
    isSupported = true;
  } else if (chainId) {
    chainLabel = `Chain ${chainId}`;
  }

  return {
    chainId,
    chainLabel,
    isSupported
  };
}
