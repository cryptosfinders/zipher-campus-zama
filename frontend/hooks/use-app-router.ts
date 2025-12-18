'use client'

import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Provides the Next.js app router with NextTopLoader progress integration.
 */
export function useAppRouter(): AppRouterInstance {
  return useRouter()
}
