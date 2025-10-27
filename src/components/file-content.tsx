import type { EntryType } from "@/collections"
import type { Headings } from "renoun"
import { getBreadcrumbItems, getFileContent, getSections } from "@/collections"
import { SiteBreadcrumb } from "@/components/breadcrumb"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import { MobileTableOfContents } from "@/components/table-of-contents"
import { cn } from "@/lib/utils"
import { TableOfContents as RenounTableOfContents } from "renoun"
import { TableOfContentsScript } from "renoun/components/TableOfContents/TableOfContents"

export async function FileContent({ source }: { source: EntryType }) {
  // maybe this is obsolete, since we called them earlier in the `DocsPage` component
  // but to have a similiar behaviour as we have in the `DirectoryContent` component
  // we use `source` as input and we have to call the `getFileContent` again
  const file = await getFileContent(source)
  if (!file) {
    return null
  }

  const metadata = await file.getExportValue("metadata")

  // current workaround to get the correct typing for headings
  const headings: Headings = await file.getExportValue("headings")
  // // alternative approach which we discussed at discord
  // const headings2 = await file
  //   .getExport("headings")
  //   .then((mod) => mod.getRuntimeValue())

  // const createdAt = await source.getFirstCommitDate()
  // const lastUpdate = await source.getLastCommitDate()
  const breadcrumbItems = await getBreadcrumbItems(file.getPathnameSegments())

  const sections = await getSections(source)
  const Content = await file.getExportValue("default")

  if (metadata.externalLink) {
    return null
  }

  return (
    <>
      <div className="container py-6">
        {headings.length > 0 && metadata.toc && (
          <MobileTableOfContents toc={headings} />
        )}

        <div
          className={cn("gap-8 xl:grid", {
            "mt-12 xl:mt-0": headings.length > 0 && metadata.toc,
            "xl:grid-cols-[1fr_300px]": metadata.toc,
            "xl:grid-cols-1": !metadata.toc,
          })}
        >
          <div
            className={cn("mx-auto", {
              "w-full 2xl:w-4xl": !metadata.toc,
              "w-full 2xl:w-2xl": metadata.toc,
            })}
          >
            <SiteBreadcrumb items={breadcrumbItems} />

            <div data-pagefind-body>
              <h1
                className="no-prose mb-2 scroll-m-20 text-3xl font-light tracking-tight sm:text-4xl md:text-5xl"
                data-pagefind-meta="title"
              >
                {metadata.title ?? source.getTitle()}
              </h1>
              <p className="mb-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                {metadata.description ?? ""}
              </p>
              <article>
                <div
                  className={cn(
                    // default prose
                    "prose dark:prose-invert",
                    // remove backtick from inline code block
                    // "prose-code:before:hidden prose-code:after:hidden",
                    // use full width
                    "max-w-auto w-full min-w-full",
                    "grow",

                    // "prose-table:my-0",
                    // "prose-th:pb-0",

                    // "xl:prose-headings:scroll-mt-20",
                    // "prose-headings:scroll-mt-28",

                    // "prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic",
                    // "prose-p:leading-7 not-first:prose-p:mt-6",

                    // "prose-ul:ml-6 prose-ul:list-disc [&>li]:prose-ul:mt-2 [&>ul]:prose-ul:my-2 [&>ul]:prose-ul:ml-0",
                  )}
                >
                  <Content />
                </div>

                <SectionGrid sections={sections} />
              </article>
            </div>
            <Siblings source={source} />
          </div>

          {metadata.toc ? (
            <div className="hidden w-78 xl:sticky xl:top-20 xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pr-6 xl:pb-16">
              <RenounTableOfContents
                headings={headings}
                components={{
                  Title: (props) => (
                    <h4
                      className="mt-0 mb-4 text-xs font-medium uppercase"
                      {...props}
                    >
                      On this page
                    </h4>
                  ),
                  List: ({ depth, children }) => {
                    return (
                      <ol
                        aria-level={depth}
                        className={cn("mt-1", {
                          "pl-0": depth === 0,
                          "pl-4": depth >= 1,
                        })}
                      >
                        {children}
                      </ol>
                    )
                  },
                  Item: (props) => {
                    return (
                      <li
                        className="mb-1 text-sm leading-6 last:mb-0"
                        {...props}
                      />
                    )
                  },
                  Link: (props) => {
                    return (
                      <a
                        {...props}
                        className="aria-current:font-bold aria-current:text-primary"
                      />
                    )
                  },
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
      <TableOfContentsScript />
    </>
  )
}
