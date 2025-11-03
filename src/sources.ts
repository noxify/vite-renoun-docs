import { Directory, withSchema } from "renoun/file-system"

import type { DocSchema } from "./validations"
import { metadataSchema } from "./validations"

type ElementType<T extends readonly unknown[]> =
  T extends readonly (infer ElementType)[] ? ElementType : never

const sources = ["aria-docs", "renoun-docs", "test-collection"] as const

export function generateDirectories() {
  return sources.map((directory) => {
    return new Directory({
      path: `content/${directory}`,
      basePathname: directory,
      repository: {
        host: "github",
        owner: "noxify",
        repository: "vite-renoun-docs",
        branch: "main",
        baseUrl: "https://github.com",
      },
      // hide hidden files ( starts with `_` ) and all asset directories ( `_assets` )
      // exclude also files which starts with a dot ( `.` ), which is needed for our datasources content
      filter: (entry) =>
        !entry.getBaseName().startsWith("_") &&
        !entry.getBaseName().startsWith(".") &&
        !entry.getAbsolutePath().includes("_assets"),
      loader: () => {
        const modules = import.meta.glob<DocSchema>(`../content/**/*.mdx`)

        return {
          mdx: withSchema<DocSchema>(async (filePath) => {
            const modulesPath = `../content/${directory}/${filePath}.mdx`

            const pageContent = await modules[modulesPath]()

            const metadata = await metadataSchema.safeParseAsync(
              pageContent.metadata,
            )

            if (!metadata.success) {
              console.error(
                `Metadata validation failed for file: ${filePath} in directory: ${directory}`,
              )
              throw metadata.error
            }

            return { ...pageContent, metadata: metadata.data }
          }),
        }
      },
    })
  })
}

export type AllowedGroupName = ElementType<typeof sources>
