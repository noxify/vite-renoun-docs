import type { ReactNode } from "react"
import reactElementToJSXString from "react-element-to-jsx-string"
import { CodeBlock } from "renoun/components"

export function Preview({ children }: { children: ReactNode }) {
  return (
    <section>
      <div>
        <div className="dot-background rounded-md rounded-b-none border border-b-0 p-8 dark:border-gray-700">
          <div className="border bg-background p-4">{children}</div>
        </div>
        <CodeBlock
          className={{ container: "mx-px! rounded-t-none!" }}
          allowErrors
          showLineNumbers
          allowCopy
          showToolbar={false}
          language="tsx"
          shouldAnalyze={false}
          shouldFormat={false}
        >
          {reactElementToJSXString(children)}
        </CodeBlock>
      </div>
    </section>
  )
}
