import fs from "node:fs"
import path from "node:path"
import { Readable } from "node:stream"
import type { Plugin, ResolvedConfig } from "vite"

import { RSC_POSTFIX } from "./shared"
import { printTreeView } from "./utils"

export default function myPlugin(): Plugin[] {
  const reactRscConfig: Plugin = {
    name: "vite-plugin-react-rsc-ssg-pages:rscConfig",
    config() {
      return {
        environments: {
          rsc: {
            build: {
              rollupOptions: {
                input: {
                  index: path.resolve(import.meta.dirname, "./entry.rsc.tsx"),
                },
              },
            },
          },
          ssr: {
            build: {
              rollupOptions: {
                input: {
                  index: path.resolve(import.meta.dirname, "./entry.ssr.tsx"),
                },
              },
            },
          },
          client: {
            build: {
              rollupOptions: {
                input: {
                  index: path.resolve(
                    import.meta.dirname,
                    "./entry.browser.tsx",
                  ),
                },
              },
            },
          },
        },
      }
    },
  }

  const rscSsgPagesPlugin: Plugin = {
    name: "vite-plugin-rsc-ssg-pages:ssgPlugin",
    config: {
      order: "pre",
      handler(_config, env) {
        return {
          appType: env.isPreview ? "mpa" : undefined,
          rsc: {
            serverHandler: env.isPreview ? false : undefined,
          },
        }
      },
    },
    buildApp: {
      async handler(builder) {
        console.log("Starting RSC SSG Pages build...")
        await renderStatic(builder.config)
        process.exit(0)
      },
    },
  }

  return [reactRscConfig, rscSsgPagesPlugin]
}

async function renderStatic(config: ResolvedConfig) {
  // import server entry
  const entryPath = path.join(config.environments.rsc.build.outDir, "index.js")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/consistent-type-imports
  const entry: typeof import("./entry.rsc") = await import(entryPath)

  console.log("Generating static paths...")
  // get static paths from all pages based on their `generateStaticParamss` export
  const staticPaths = await entry.getStaticRoutes()

  console.log("Rendering static paths...")

  // render rsc and html
  const baseDir = config.environments.client.build.outDir
  for (const staticPatch of staticPaths.generated) {
    const { html, rsc } = await entry.handleSsg(
      new Request(new URL(staticPatch, "http://ssg.local")),
    )

    await writeFileStream(
      path.join(baseDir, normalizeHtmlFilePath(staticPatch)),
      html,
    )
    await writeFileStream(path.join(baseDir, staticPatch + RSC_POSTFIX), rsc)
  }

  printTreeView(staticPaths.tree)
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  await fs.promises.writeFile(filePath, Readable.fromWeb(stream as any))
}

function normalizeHtmlFilePath(p: string) {
  if (p.endsWith("/")) {
    return p + "index.html"
  }
  return p + ".html"
}
