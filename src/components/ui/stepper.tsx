import type { PropsWithChildren } from "react"
import type { Simplify } from "type-fest"
import { Children } from "react"
import { cn } from "@/lib/utils"

export type StepperProps = Simplify<PropsWithChildren>
export type StepperItemProps = Simplify<
  PropsWithChildren<{
    title?: string
  }>
>

/**
 * A vertical stepper component that displays steps with numbers and connecting lines.
 *
 * @param children - The stepper items to be displayed within the stepper
 * @returns A React component rendering the stepper
 */
export function Stepper({ children }: StepperProps) {
  const length = Children.count(children)

  return (
    <div className="ml-4 flex flex-col">
      {Children.map(children, (child, index) => {
        return (
          <div
            className={cn(
              "relative border-l pl-9",
              cn({
                "pb-5": index < length - 1,
              }),
            )}
          >
            <div className="font-code absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {index + 1}
            </div>
            {child}
          </div>
        )
      })}
    </div>
  )
}

/**
 * A single item within the Stepper component.
 *
 * @param title - The title of the step
 * @param children - The content of the step
 * @returns A React component rendering a stepper item
 */
export function StepperItem({ title, children }: StepperItemProps) {
  return (
    <div className="pt-0.5">
      <h4 className="mt-0">{title}</h4>
      <div>{children}</div>
    </div>
  )
}
