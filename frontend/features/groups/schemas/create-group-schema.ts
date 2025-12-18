import { z } from "zod"

export const createGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),

  galleryUrls: z.array(z.string()).default([]),

  visibility: z.enum(["public", "private"]),
  billingCadence: z.enum(["free", "monthly"]),

  shortDescription: z.string().optional(),
  aboutUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  tags: z.string().optional(),
  price: z.string().optional(),
})
