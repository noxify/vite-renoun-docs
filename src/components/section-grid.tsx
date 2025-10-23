import type { getSections } from "@/collections"
import type { metadataSchema } from "@/validations"
import type { z } from "zod"
import { getFileContent, getTitle, isExternal, isHidden } from "@/collections"
import { removeFromArray } from "@/lib/utils"

import Link from "./link-component"
import { Card, CardContent, CardHeader } from "./ui/card"

export default async function SectionGrid({
  sections,
}: {
  sections: Awaited<ReturnType<typeof getSections>>
}) {
  if (sections.length === 0) {
    return <></>
  }

  const elements = []

  for (const section of sections) {
    if (isHidden(section) || (await isExternal(section))) {
      continue
    }

    let file: Awaited<ReturnType<typeof getFileContent>>
    let metadata: z.infer<typeof metadataSchema> | undefined
    try {
      file = await getFileContent(section)
      metadata = await file?.getExportValue("metadata")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      continue
    }

    if (!metadata) {
      elements.push({
        title: section.getTitle(),
        description: "",
        path: `/docs/${removeFromArray(section.getPathnameSegments(), ["index"]).join("/")}`,
      })
    } else {
      const title = getTitle(section, metadata)

      elements.push({
        title,
        description: metadata.description ?? "",
        path: `/docs/${removeFromArray(section.getPathnameSegments(), ["index"]).join("/")}`,
      })
    }
  }

  return (
    <div
      className="mt-12 grid auto-rows-fr items-stretch gap-4 md:grid-cols-2 2xl:grid-cols-2"
      data-pagefind-ignore
    >
      {elements.map((ele, index) => {
        return (
          <Link href={ele.path} key={index}>
            <Card className="group h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <h3 className="text-xl leading-tight font-semibold transition-colors">
                  {ele.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {ele.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
