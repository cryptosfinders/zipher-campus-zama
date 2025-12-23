import { useMemo } from 'react'

import { AlertTriangle, Clock, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { formatTimestampRelative } from '@/lib/time'
import { cn } from '@/lib/utils'
import { usePlatformFeeQuote } from '@/hooks/use-platform-fee-quote'
import { useGroupContext } from '../context/group-context'
import { useRenewSubscription } from '../hooks/use-renew-subscription'

const ZIPHER_GOLD = '#F7C948'
const ZIPHER_GOLD_BG = 'rgba(247, 201, 72, 0.12)'
const ZIPHER_GOLD_BORDER = 'rgba(247, 201, 72, 0.32)'

export function GroupSubscriptionBanner() {
  const { isOwner, subscription } = useGroupContext()
  const { renew, isRenewing } = useRenewSubscription()
  const { quote } = usePlatformFeeQuote()

  const platformFeeLabel = quote
  ? quote.displayAmount
  : '—'

  const shouldShowBanner =
    isOwner && (subscription.isExpired || subscription.isRenewalDue)

  const statusLabel = useMemo(() => {
    if (subscription.isExpired) {
      return `Expired ${
        subscription.endsOn
          ? formatTimestampRelative(subscription.endsOn)
          : 'recently'
      }`
    }
    if (subscription.endsOn) {
      return `Renews ${formatTimestampRelative(subscription.endsOn)}`
    }
    return 'Renewal required soon'
  }, [subscription.endsOn, subscription.isExpired])

  if (!shouldShowBanner) return null

  const handleRenew = async () => {
    try {
      const result = await renew()
      toast.success(
        `Subscription renewed. Next renewal ${
          result.endsOn
            ? formatTimestampRelative(result.endsOn)
            : 'scheduled in 30 days'
        }.`
      )
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Failed to renew the subscription. Please try again.'
      )
    }
  }

  const isExpired = subscription.isExpired

  return (
    <div
      className="border-b"
      style={{
        background: isExpired ? ZIPHER_GOLD_BG : ZIPHER_GOLD_BG,
        borderColor: ZIPHER_GOLD_BORDER
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ICON + TEXT */}
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{
              borderColor: ZIPHER_GOLD_BORDER,
              background: ZIPHER_GOLD_BG,
              color: ZIPHER_GOLD
            }}
          >
            {isExpired ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
          </span>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-black">
              {isExpired
                ? 'Your group is paused until you renew.'
                : 'Renew soon to keep your community online.'}
            </p>
            <p className="text-xs text-neutral-700">
              {statusLabel}. Pay {platformFeeLabel} to extend access for 30 days.
            </p>
          </div>
        </div>

        {/* RENEW BUTTON */}
        <Button
          onClick={handleRenew}
          disabled={isRenewing}
          className="inline-flex items-center gap-2 self-start sm:self-auto font-semibold"
          style={{
            background: ZIPHER_GOLD,
            color: '#111',
            borderColor: ZIPHER_GOLD
          }}
        >
          <RefreshCcw className="h-4 w-4" />
          {isRenewing ? 'Processing...' : 'Renew subscription'}
        </Button>
      </div>
    </div>
  )
}
