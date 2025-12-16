"use client";

import { useWallet } from "@/lib/web3/WalletProvider";
import { useGroupListing } from "@/hooks/use-group-listing";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function EncryptedCourseCard({ item }: any) {
  const { address } = useWallet();
  const { setListing } = useGroupListing();

  const isOwner = item.isOwner;
  const isPaid = item.price > 0;

  async function toggleListing(checked: boolean) {
    if (!address) return;

    try {
      await setListing({
        address,
        groupId: item.groupId,
        isListed: checked,
      });

      toast.success(
        checked
          ? "Listed on marketplace"
          : "Removed from marketplace"
      );
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update listing");
    }
  }

  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <div className="aspect-video rounded-lg bg-muted overflow-hidden">
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <h3 className="text-sm font-semibold">{item.title}</h3>

      <p className="text-xs text-muted-foreground">
        {item.description}
      </p>

      <p className="text-xs">
        <span className="font-semibold text-primary">
          {item.price} USD / month
        </span>
      </p>

      {/* 🔐 CREATOR LISTING TOGGLE */}
      {isOwner && isPaid && (
        <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
          <span className="text-xs font-medium">
            List on marketplace
          </span>
          <Switch
            checked={item.isListed}
            onCheckedChange={toggleListing}
          />
        </div>
      )}
    </div>
  );
}
