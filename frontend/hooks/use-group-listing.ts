import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGroupListing() {
  const setListing = useMutation(
    api.groups.setMarketplaceListing
  );

  return { setListing };
}
