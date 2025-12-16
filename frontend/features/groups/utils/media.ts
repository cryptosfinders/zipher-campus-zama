'use client'

import { extractStorageId, isStorageReference } from '@/lib/media'

/**
 * Normalize media input to a clean string.
 */
export function normalizeMediaInput(value: string | undefined | null): string {
  if (!value) return ''
  return String(value).trim()
}

/**
 * Accepts:
 * - Convex storage:abc123 refs
 * - Image URLs
 * - Video URLs
 * - YouTube links
 */
export function isValidMediaReference(value: string | undefined | null): boolean {
  const trimmed = normalizeMediaInput(value)
  if (!trimmed) return true

  // Convex storage references
  if (isStorageReference(trimmed)) {
    return extractStorageId(trimmed).length > 0
  }

  // Try URL parsing (image, video, YouTube links)
  try {
    new URL(trimmed)
    return true
  } catch {
    return false
  }
}

/**
 * Generate a unique gallery item ID
 */
export function generateGalleryId(seed?: string): string {
  if (seed) return seed
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `gallery-${Math.random().toString(36).slice(2)}`
}
