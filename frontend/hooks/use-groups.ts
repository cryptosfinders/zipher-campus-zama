import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGroupActions() {
  const toggleMarketplaceListing = useMutation(
    api.groups.toggleMarketplaceListing
  );

  return {
    toggleMarketplaceListing,
  };
}
