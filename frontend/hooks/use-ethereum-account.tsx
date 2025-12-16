'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { getPublicClient } from '@/lib/web3/publicClient'; // ✅ Correct import

type EthereumAccountContextType = {
  address: `0x${string}` | null;
  chainId: number | null;
  publicClient: any | null;
};

const EthereumAccountContext = createContext<EthereumAccountContextType>({
  address: null,
  chainId: null,
  publicClient: null,
});

export function EthereumAccountProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const chainId = useChainId();

  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    // ✔ Your exported function returns a new public client
    setClient(getPublicClient());
  }, []);

  return (
    <EthereumAccountContext.Provider
      value={{
        address: address ?? null,
        chainId: chainId ?? null,
        publicClient: client,
      }}
    >
      {children}
    </EthereumAccountContext.Provider>
  );
}

export function useEthereumAccount() {
  return useContext(EthereumAccountContext);
}
