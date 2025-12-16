import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useEncryptedMarketCourses() {
  const data = useQuery(api.encryptedCourses.listMarketplace);
  const loading = data === undefined;

  return {
    data: data ?? [],
    loading,
  };
}

