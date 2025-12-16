// frontend/lib/onchain/registrarService.ts
'use client';

import { publicClient, getWalletClient } from '@/lib/web3/clients';
import { ADDRESSES } from './contracts';
import registrarAbi from '@/lib/abi/Registrar.json'; // adjust path

export async function getSpaceById(spaceId: bigint) {
  return publicClient.readContract({
    address: ADDRESSES.REGISTRAR,
    abi: registrarAbi,
    functionName: 'spaces',
    args: [spaceId],
  });
}

export async function createSpace(args: {
  // whatever params your Registrar#createSpace expects
  // e.g.: name: string; price: bigint; ...
}) {
  const walletClient = await getWalletClient();
  const [account] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: ADDRESSES.REGISTRAR,
    abi: registrarAbi,
    functionName: 'createSpace',
    account,
    args: [
      // params here...
    ],
  });
}
