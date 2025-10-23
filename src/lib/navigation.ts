import type { EntryType } from "@/collections"
import type { LucideIcon, LucideProps } from "lucide-react"
import { getFileContent, isHidden } from "@/collections"
import { isDirectory, isFile } from "renoun/file-system"

export interface TreeItem {
  title: string
  path: string
  isFile: boolean
  slug: string[]
  depth: number
  externalLink?: string
  children?: TreeItem[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<LucideProps> | { $$typeof: any }
}

// source:
// https://github.com/souporserious/renoun/blob/main/packages/renoun/src/file-system/index.test.ts
async function buildTreeNavigation(entry: EntryType): Promise<TreeItem | null> {
  if (isHidden(entry)) {
    return null
  }

  let icon: React.ComponentType<LucideProps> | undefined = undefined

  if (isDirectory(entry)) {
    const file = await getFileContent(entry)
    let metadata = null

    if (file) {
      metadata = await file.getExportValue("metadata")
      try {
        // same here, manually added the type
        const exportedIcon: React.ReactNode | LucideIcon =
          await file.getExportValue("icon")
        // forwardRef-Komponenten (z.B. Lucide) sind Objekte mit $$typeof und render
        if (typeof exportedIcon === "function") {
          icon = exportedIcon
        } else if (
          exportedIcon &&
          typeof exportedIcon === "object" &&
          "$$typeof" in exportedIcon
        ) {
          icon = exportedIcon as unknown as React.ComponentType<LucideProps>
        } else {
          icon = undefined
        }
      } catch {
        icon = undefined
      }
    }

    return {
      title: metadata?.navTitle ?? entry.getTitle(),
      path: `/docs${entry.getPathname()}`,
      isFile: isFile(entry),
      slug: entry.getPathnameSegments(),
      depth: entry.getDepth(),
      icon: icon ?? undefined,
      children: isDirectory(entry)
        ? (
            await Promise.all(
              (await entry.getEntries()).map((ele) => buildTreeNavigation(ele)),
            )
          ).filter((ele) => !!ele)
        : [],
    }
  } else {
    const file = await getFileContent(entry)

    if (!file) {
      return null
    }

    const metadata = await file.getExportValue("metadata")

    let fileIcon: React.ComponentType<LucideProps> | undefined = undefined
    try {
      const exportedIcon: React.ReactNode | LucideIcon =
        await file.getExportValue("icon")
      if (typeof exportedIcon === "function") {
        fileIcon = exportedIcon
      } else if (
        exportedIcon &&
        typeof exportedIcon === "object" &&
        "$$typeof" in exportedIcon
      ) {
        fileIcon = exportedIcon as unknown as React.ComponentType<LucideProps>
      } else {
        fileIcon = undefined
      }
    } catch {
      fileIcon = undefined
    }

    return {
      title: metadata.navTitle ?? entry.getTitle(),
      path: `/docs${entry.getPathname()}`,
      isFile: isFile(entry),
      slug: entry.getPathnameSegments(),
      depth: entry.getDepth(),
      icon: fileIcon,
      externalLink: metadata.externalLink,
      children: [],
    }
  }
}

export async function getTree(sources: EntryType[]): Promise<TreeItem[]> {
  return (
    await Promise.all(
      sources
        .filter((ele) => !isHidden(ele))
        .map((ele) => buildTreeNavigation(ele)),
    )
  ).filter((ele) => !!ele)
}
