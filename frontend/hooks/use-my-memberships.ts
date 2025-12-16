import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useMyMemberships(address?: string) {
  const data = useQuery(
    address ? api.memberships.myMemberships : null,
    address ? { address } : "skip"
  );

  return {
    memberships: data ?? [],
    loading: data === undefined,
  };
}
