import type { PageProps } from "@/routes"
import { cache } from "react"
import { DocumentationGroup, getFileContent } from "@/collections"
import { DirectoryContent } from "@/components/directory-content"
import { FileContent } from "@/components/file-content"
import { isDirectory } from "renoun/file-system"

const CollectionInfo = cache(() => DocumentationGroup)

export async function generateStaticParams() {
  const entries = await CollectionInfo().getEntries({
    recursive: true,
    includeIndexAndReadmeFiles: true,
  })
  const staticPaths = entries
    // get all possible routes including the collection routes
    .map((post) => {
      const [collection, ...slug] = post.getPathnameSegments()
      return { collection, slug }
    })
    // since we have a dedicated page for /docs/[collection], we can skip the empty slug entries here
    .filter(({ slug }) => slug.length > 0)

  return staticPaths
}

export default async function DocsPage({
  params,
}: PageProps<"/docs/[collection]/[...slug]">) {
  let collection

  try {
    collection = await CollectionInfo().getEntry([
      params.collection,
      ...params.slug,
    ])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    console.warn("Unable to get entry for path:", [
      params.collection,
      ...params.slug,
    ])
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
