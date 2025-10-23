import type { LayoutProps } from "@/routes"
import { cache } from "react"
import { DocumentationGroup, getFileContent } from "@/collections"
import { DirectoryContent } from "@/components/directory-content"
import { FileContent } from "@/components/file-content"
import { isDirectory } from "renoun/file-system"

const CollectionInfo = cache(() => DocumentationGroup)

export async function generateStaticParams() {
  const entries = await CollectionInfo().getEntries({
    recursive: false,
    includeIndexAndReadmeFiles: true,
  })
  const staticPaths = entries.map((post) => post.getPathnameSegments()).flat()

  return staticPaths.map((collection) => ({ collection }))
}

export default async function DocsIndexPage({
  params,
}: LayoutProps<"/docs/[collection]">) {
  let collection

  try {
    collection = await CollectionInfo().getEntry([params.collection])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    console.warn("Unable to get entry for path:", [params.collection])
    return <>Page not found</>
  }

  // check the current path if it's a valid file ( including index check for a directory )
  const file = await getFileContent(collection)

  // if we can't find an index file, but we have a valid directory
  // use the directory component for rendering
  if (!file && isDirectory(collection)) {
    return (
      <>
        <DirectoryContent source={collection} />
      </>
    )
  }

  // if we have a valid file ( including the index file )
  // use the file component for rendering
  if (file) {
    return (
      <>
        <FileContent source={collection} />
      </>
    )
  }
  return <>Page not found</>
}
