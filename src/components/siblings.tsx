import type { EntryType } from "@/collections"
import type { Collection, FileSystemEntry } from "renoun/file-system"
import {
  DocumentationGroup,
  getFileContent,
  isExternal,
  isHidden,
} from "@/collections"
import { asyncFilter } from "@/lib/async-filter"
import { removeFromArray } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { isDirectory, isFile } from "renoun/file-system"

import Link from "./link-component"

async function getSiblingDetails(source?: EntryType) {
  if (!source) {
    return null
  }

  const file = await getFileContent(source)
  if (!file) {
    return null
  }

  const metadata = await file.getExportValue("metadata")

  return {
    title: metadata.navTitle ?? metadata.title ?? file.getTitle(),
    path: `/docs/${removeFromArray(file.getPathnameSegments(), ["index"]).join("/")}`,
  }
}

export default async function Siblings({ source }: { source: EntryType }) {
  const [previousPage, nextPage] = await getSiblings(source, {
    entryGroup: DocumentationGroup,
  })

  if (!previousPage && !nextPage) {
    return <></>
  }

  const previousPageDetails = await getSiblingDetails(previousPage)

  const nextPageDetails = await getSiblingDetails(nextPage)

  return (
    <nav
      className="mt-6 flex items-center justify-between border-t pt-6"
      data-pagefind-ignore
    >
      <div className="flex w-0 flex-1">
        {previousPageDetails && (
          <>
            <Link
              href={previousPageDetails.path}
              title={`Go to previous page: ${previousPageDetails.title}`}
            >
              <div className="group flex shrink-0 items-center gap-x-4">
                <ChevronLeftIcon className="h-5 w-5 flex-none text-sidebar-foreground transition-colors duration-200 group-hover:text-primary" />
                <div className="flex flex-col items-start">
                  <p className="text-xs leading-5 text-gray-500">
                    Previous page
                  </p>
                  <p className="text-sm leading-5 font-medium text-secondary-foreground/70 transition-colors duration-200 group-hover:text-secondary-foreground">
                    {previousPageDetails.title}
                  </p>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        {nextPageDetails && (
          <>
            <Link
              href={nextPageDetails.path}
              title={`Go to next page: ${nextPageDetails.title}`}
            >
              <div className="group flex shrink-0 items-center gap-x-4">
                <div className="flex flex-col items-end">
                  <p className="text-xs leading-5 text-gray-500">Next page</p>
                  <p className="text-sm leading-5 font-medium text-secondary-foreground/70 transition-colors duration-200 group-hover:text-secondary-foreground">
                    {nextPageDetails.title}
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 flex-none text-sidebar-foreground transition-colors duration-200 group-hover:text-primary" />
              </div>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

// inspired by
// * https://github.com/souporserious/renoun/blob/main/packages/renoun/src/file-system/index.tsx#L497
async function getSiblings<
  GroupTypes extends Record<string, unknown> = Record<string, unknown>,
>(
  source: EntryType,
  options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entryGroup: Collection<GroupTypes, FileSystemEntry<any>[]>
    includeAll?: boolean
  },
): Promise<[EntryType | undefined, EntryType | undefined]> {
  let entries = await options.entryGroup.getEntries({
    recursive: true,
    includeIndexAndReadmeFiles: false,
  })

  if (!options.includeAll) {
    entries = entries.filter(
      (ele) => ele.getPathnameSegments()[0] == source.getPathnameSegments()[0],
    )
  }

  entries = entries.filter(
    (ele) => !isHidden(ele) && (isDirectory(ele) || isFile(ele, "mdx")),
  )

  entries = await asyncFilter(entries, async (ele) => !(await isExternal(ele)))

  let currentPath = ""

  if (isFile(source) && source.getBaseName() === "index") {
    currentPath = source.getParent().getPathname()
  } else {
    currentPath = source.getPathname()
  }

  const currentIndex = entries.findIndex(
    (ele) => ele.getPathname() === currentPath,
  )

  const previousElement =
    currentIndex > 0 ? entries[currentIndex - 1] : undefined

  const nextElement =
    currentIndex < entries.length - 1 ? entries[currentIndex + 1] : undefined

  return [previousElement, nextElement]
}
