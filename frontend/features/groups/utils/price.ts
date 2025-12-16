/**
 * Zipher Campus price formatter
 * -----------------------------
 * - Only handles USD pricing (matching private FHE course platform)
 * - Removes PushChain / token logic
 * - Supports "Free", one-time price, or optional monthly cadence
 */

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

export type BillingCadence = 'free' | 'once' | 'monthly' | undefined

export function formatGroupPriceLabel(
  price: number | undefined,
  cadence: BillingCadence,
  options?: { includeCadence?: boolean }
) {
  const includeCadence = options?.includeCadence ?? true

  // Free tier
  if (!price || price <= 0 || cadence === 'free') {
    return includeCadence ? 'Free' : 'Join for free'
  }

  const formattedPrice = USD.format(price)

  if (!includeCadence || cadence === 'once') {
    return formattedPrice
  }

  // Monthly subscription (if you support it later)
  if (cadence === 'monthly') {
    return `${formattedPrice}/month`
  }

  return formattedPrice
}
