// frontend/hooks/use-platform-fee-quote.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  PLATFORM_FEE_BPS,
  PLATFORM_MIN_FEE_WEI
} from '@/lib/config';
import { formatNativeToken } from '@/lib/native-token';

/**
 * Fetch ETH/USD price from Coingecko with fallback.
 */
async function fetchEthPriceUSD(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await res.json();
    return data.ethereum.usd;
  } catch {
    return 3500; // fallback if API fails
  }
}

export type PlatformFeeQuote = {
  amountWei: bigint;
  displayAmount: string;
};

export function usePlatformFeeQuote() {
  const [quote, setQuote] = useState<PlatformFeeQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Hardcoded $1 platform fee in USD
      const usdPrice = 1;
      const ethUsd = await fetchEthPriceUSD();
      const ethValue = usdPrice / ethUsd;

      const weiValue = BigInt(Math.floor(ethValue * 1e18));

      const bpsFee =
        (weiValue * BigInt(PLATFORM_FEE_BPS)) / BigInt(10000);
      const minFee = BigInt(PLATFORM_MIN_FEE_WEI);

      const finalFee = bpsFee < minFee ? minFee : bpsFee;

      const next: PlatformFeeQuote = {
        amountWei: finalFee,
        displayAmount: formatNativeToken(finalFee)
      };

      setQuote(next);
      return next;
    } catch (e: any) {
      setError(e?.message || 'Failed to compute platform fee.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    quote,
    loading,
    error,
    refresh
  };
}
