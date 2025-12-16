import { NATIVE_TOKEN_DECIMALS, NATIVE_TOKEN_SYMBOL } from '@/lib/config'
import { parseUnits, formatUnits } from 'viem'

export function parseNativeTokenAmount(value: string) {
  if (!value) return 0n
  return parseUnits(value, NATIVE_TOKEN_DECIMALS)
}

export function formatNativeToken(amount: bigint) {
  return `${formatUnits(amount, NATIVE_TOKEN_DECIMALS)} ${NATIVE_TOKEN_SYMBOL}`
}
