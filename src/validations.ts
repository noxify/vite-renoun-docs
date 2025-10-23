import type { LucideIcon } from "lucide-react"
import type { Headings } from "renoun"
import z from "zod"

export const metadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  navTitle: z.string().optional(),
  entrypoint: z.string().optional(),
  alias: z.string().optional(),
  toc: z.boolean().optional().default(true),
  externalLink: z.url().optional(),
})

export type Metadata = z.infer<typeof metadataSchema>

export interface DocSchema {
  metadata: Metadata
  headings: Headings
  icon?: React.ReactNode | LucideIcon
}
