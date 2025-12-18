import { z } from 'zod'
import { isValidMediaReference } from '@/features/groups/utils/media'

export const createGroupSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name must be at most 80 characters'),

    shortDescription: z
      .string()
      .max(200, 'Keep the summary under 200 characters')
      .optional()
      .or(z.literal('')),

    aboutUrl: z
      .string()
      .trim()
      .url('Enter a valid URL')
      .optional()
      .or(z.literal('')),

    thumbnailUrl: z.string().optional(),

    // 🔑 REQUIRED (this is what broke your build earlier)
    galleryUrls: z.array(z.string()).default([]),

    tags: z.string().optional(),

    visibility: z.enum(['public', 'private']).default('private'),

    billingCadence: z.enum(['free', 'monthly']).default('free'),

    price: z.string().optional()
  })
  .superRefine((data, ctx) => {
    /* -------- Paid memberships -------- */
    if (data.billingCadence === 'monthly') {
      if (!data.price || data.price.trim() === '') {
        ctx.addIssue({
          path: ['price'],
          code: z.ZodIssueCode.custom,
          message: 'Monthly price required'
        })
      } else if (Number.isNaN(Number(data.price))) {
        ctx.addIssue({
          path: ['price'],
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid number'
        })
      } else if (Number(data.price) <= 0) {
        ctx.addIssue({
          path: ['price'],
          code: z.ZodIssueCode.custom,
          message: 'Price must be greater than zero'
        })
      }

      if (data.visibility !== 'private') {
        ctx.addIssue({
          path: ['visibility'],
          code: z.ZodIssueCode.custom,
          message: 'Paid groups must be private'
        })
      }
    }

    /* -------- Media validation -------- */
    if (!isValidMediaReference(data.thumbnailUrl)) {
      ctx.addIssue({
        path: ['thumbnailUrl'],
        code: z.ZodIssueCode.custom,
        message:
          'Thumbnail must be a Convex upload, image URL, or supported video link.'
      })
    }

    data.galleryUrls.forEach((value, index) => {
      if (!isValidMediaReference(value)) {
        ctx.addIssue({
          path: ['galleryUrls', index],
          code: z.ZodIssueCode.custom,
          message:
            'Each gallery item must be a Convex upload, image URL, or supported video link.'
        })
      }
    })
  })

export type CreateGroupFormValues = z.infer<typeof createGroupSchema>
