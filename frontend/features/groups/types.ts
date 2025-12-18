export type CreateGroupFormValues = {
  name: string
  galleryUrls: string[]
  visibility: "public" | "private"
  billingCadence: "free" | "monthly"
  shortDescription?: string
  aboutUrl?: string
  thumbnailUrl?: string
  tags?: string
  price?: string
}
