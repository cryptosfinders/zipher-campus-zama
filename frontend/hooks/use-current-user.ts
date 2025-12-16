'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useWallet } from '@/lib/web3/WalletProvider';

/**
 * Returns:
 * - address: wallet address (string | null)
 * - user: DB record of user (Doc<'users'> | null)
 * - loading: boolean
 */
export function useCurrentUser() {
  const { address } = useWallet();

  const user = useQuery(
    api.users.getByAddress,
    address ? { address } : undefined
  );

  return {
    address,
    currentUser: user ?? null,
    loading: user === undefined
  };
}

