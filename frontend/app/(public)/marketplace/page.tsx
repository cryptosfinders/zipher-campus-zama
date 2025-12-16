import { MarketplaceHero } from "@/features/marketplace/components/marketplace-hero";
import { EncryptedMarketplaceShell } from "@/features/marketplace/components/encrypted-marketplace-shell";

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <MarketplaceHero />
      <EncryptedMarketplaceShell />
    </div>
  );
}

