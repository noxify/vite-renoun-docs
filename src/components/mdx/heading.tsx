import type { ElementType, JSX, ReactNode } from "react"
import { cn } from "@/lib/utils"

type IntrinsicElement = keyof JSX.IntrinsicElements
type PolymorphicComponentProps<T extends IntrinsicElement> = {
  as?: T
} & JSX.IntrinsicElements[T]

const PolymorphicComponent = <T extends IntrinsicElement>({
  as: elementType = "div" as T,
  ...rest
}: PolymorphicComponentProps<T>) => {
  const Component = elementType as ElementType
  return <Component {...rest} />
}

export function Heading({
  level,
  id,
  children,
  className,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6
  id?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <PolymorphicComponent
      as={`h${level}` as keyof JSX.IntrinsicElements}
      id={id}
      className={cn(
        "group mt-8 mb-4 flex scroll-m-28 gap-2 tracking-tight",
        className,
      )}
    >
      {children}{" "}
      <a
        href={`#${id}`}
        className={cn(
          "hidden font-light no-underline group-hover:inline-block group-hover:text-primary",
          //className,
        )}
      >
        #
      </a>
    </PolymorphicComponent>
  )
}
