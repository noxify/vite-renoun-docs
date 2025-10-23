import { Directory, withSchema } from "renoun/file-system"

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
      loader: {
        mdx: withSchema({ metadata: metadataSchema }, (filePath) => {
          const modules = import.meta.glob(`../content/**/*.mdx`, {
            eager: true,
          })

          const modulesPath = `../content/${directory}/${filePath}.mdx`

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
          return modules[modulesPath] as any
        }),
      },
    })
  })
}

export type AllowedGroupName = ElementType<typeof sources>
