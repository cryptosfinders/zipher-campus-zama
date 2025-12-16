'use client'

import { createWalletClient, custom, parseUnits } from 'viem'
import { mainnet, sepolia, hardhat } from 'viem/chains'

/**
 * Global MetaMask type
 */
declare global {
  interface Window {
    ethereum?: any
  }
}

/**
 * Detect MetaMask
 */
export function getInjectedProvider(): any {
  if (typeof window === 'undefined') return null
  return window.ethereum ?? null
}

/**
 * Create a viem Wallet Client bound to MetaMask
 */
export function getWalletClient() {
  const provider = getInjectedProvider()
  if (!provider) throw new Error('MetaMask not detected')

  return createWalletClient({
    chain: undefined, // auto-detect from MetaMask
    transport: custom(provider)
  })
}

/**
 * Connect MetaMask & get accounts
 */
export async function requestAddress(): Promise<`0x${string}`> {
  const provider = getInjectedProvider()
  if (!provider) throw new Error('MetaMask not found')

  const accounts = await provider.request({
    method: 'eth_requestAccounts'
  })

  return accounts[0] as `0x${string}`
}

/**
 * Read current active address (if connected)
 */
export async function getCurrentAddress(): Promise<`0x${string}` | null> {
  const provider = getInjectedProvider()
  if (!provider) return null

  const accounts = await provider.request({ method: 'eth_accounts' })
  return accounts.length > 0 ? (accounts[0] as `0x${string}`) : null
}

/**
 * Read chain ID from MetaMask
 */
export async function getChainId(): Promise<number> {
  const provider = getInjectedProvider()
  if (!provider) throw new Error('MetaMask not found')

  const hex = await provider.request({ method: 'eth_chainId' })
  return Number(hex)
}

/**
 * Request chain switch in MetaMask
 */
export async function switchChain(targetChainId: number) {
  const provider = getInjectedProvider()
  if (!provider) throw new Error('MetaMask not found')

  const hex = `0x${targetChainId.toString(16)}`

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hex }]
    })
  } catch (err: any) {
    console.error('MetaMask failed to switch chain:', err)
    throw err
  }
}

/**
 * Send transaction using MetaMask wallet
 */
export async function sendTx(tx: {
  to: `0x${string}`
  data?: `0x${string}`
  valueWei?: bigint
}) {
  const provider = getInjectedProvider()
  if (!provider) throw new Error('MetaMask not found')

  const from = await requestAddress()

  const txParams: any = {
    from,
    to: tx.to,
    data: tx.data ?? '0x'
  }

  if (tx.valueWei) {
    txParams.value = `0x${tx.valueWei.toString(16)}`
  }

  return provider.request({
    method: 'eth_sendTransaction',
    params: [txParams]
  })
}
