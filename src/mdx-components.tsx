import type { alertVariants } from "@/components/ui/alert"
import type { VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import type { CodeBlockProps, CodeInlineProps } from "renoun/components"
import type { MDXComponents } from "renoun/mdx"
import { DataTableBuilder } from "@/components/data-table/data-table-builder"
import { Heading } from "@/components/heading"
import MermaidWrapper from "@/components/mermaid-wrapper"
import RailroadWrapper from "@/components/railroad-wrapper"
import {
  Accordion as BaseAccordion,
  AccordionContent as BaseAccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger as BaseAccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Stepper, StepperItem } from "@/components/ui/stepper"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Video from "@/components/video"
import {
  BookOpenTextIcon,
  CircleAlertIcon,
  CircleCheckBigIcon,
  CoffeeIcon,
} from "lucide-react"
import { CodeBlock, CodeInline, parseCodeProps } from "renoun/components"
import { createSlug } from "renoun/mdx"

import Link from "./components/link-component"
import { Preview } from "./components/preview"

type AnchorProps = ComponentPropsWithoutRef<"a">

export function useMDXComponents() {
  return {
    h1: (props) => {
      return (
        <Heading
          level={1}
          {...props}
          className="text-4xl font-bold md:text-5xl"
        />
      )
    },
    h2: (props) => {
      return (
        <Heading
          level={2}
          {...props}
          className="border-b pb-2 text-3xl font-semibold md:text-4xl"
        />
      )
    },
    h3: (props) => {
      return (
        <Heading
          level={3}
          {...props}
          className="text-2xl font-semibold md:text-3xl"
        />
      )
    },
    h4: (props) => {
      return (
        <Heading
          level={4}
          {...props}
          className="text-xl font-medium md:text-2xl"
        />
      )
    },
    h5: (props) => {
      return (
        <Heading
          level={5}
          {...props}
          className="text-lg font-medium md:text-xl"
        />
      )
    },
    h6: (props) => {
      return (
        <Heading
          level={6}
          {...props}
          className="text-base font-medium md:text-lg"
        />
      )
    },
    p: (props) => {
      return <p className="leading-7 not-first:mt-6" {...props} />
    },
    // links ( relative, absolute, remote, mails )
    a: ({ href, children, ...props }: AnchorProps) => {
      return (
        <Link href={href} {...props} className="font-medium">
          {children}
        </Link>
      )
    },
    // markdown image handler
    img: (props) => (
      <section>
        <div className="mb-4 flex items-center justify-center">
          {/* <div className="dot-background rounded-md border p-8 md:w-3/4 dark:border-gray-700"> */}
          <div className="border bg-background p-4">
            <img
              {...props}
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
              className="not-prose object-contain"
            />
          </div>
          {/* </div> */}
        </div>
      </section>
    ),
    // if you decide to use `<Image />` inside your mdx, you have the possibility to overwrite
    // the default values ( e.g. for width, height or className ) - we do this differently from the `img` tag above
    // because we think if you use `<Image />` inside your mdx, you should have this flexibility
    // if this is not what you want - feel free to change the code below or import the `Image` component directly
    Image: (props) => (
      <section>
        <div className="mb-4 flex items-center justify-center">
          {/*  <div className="dot-background rounded-md border p-8 md:w-3/4 dark:border-gray-700"> */}
          <div className="border bg-background p-4">
            <img
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
              className="not-prose object-contain"
              {...props}
            />
            {/* </div>*/}
          </div>
        </div>
      </section>
    ),

    // Inline code
    code: (props: CodeInlineProps) => {
      return (
        <CodeInline
          {...parseCodeProps(props)}
          shouldAnalyze={false}
          allowErrors
          css={{
            backgroundColor: "hsl(var(--secondary))",
            color: "auto",
            boxShadow: "none",
            display: "inline",
          }}
          paddingX="auto"
          paddingY="auto"
          className="border px-2 py-0.5 text-xs"
        />
      )
    },
    CodeInline: (props: CodeInlineProps) => {
      return (
        <CodeInline
          {...parseCodeProps(props)}
          shouldAnalyze={false}
          allowErrors
          css={{
            backgroundColor: "hsl(var(--secondary))",
            color: "auto",
            boxShadow: "none",
            display: "inline",
          }}
          paddingX="auto"
          paddingY="auto"
          className="border px-2 py-0.5 text-xs"
        />
      )
    },
    // Code block
    pre: (props: CodeBlockProps) => {
      if (props.language === "mermaid") {
        return <MermaidWrapper chart={props.children as string} />
      }

      // @ts-expect-error railroad is not a valid language
      if (props.language === "railroad") {
        return <RailroadWrapper content={props.children as string} />
      }

      return (
        <CodeBlock
          {...props}
          className={{ container: "my-4!" }}
          shouldAnalyze={false}
          shouldFormat={false}
        />
      )
    },
    CodeBlock: (props: CodeBlockProps) => {
      if (props.language === "mermaid") {
        return <MermaidWrapper chart={props.children as string} />
      }

      // @ts-expect-error railroad is not a valid language
      if (props.language === "railroad") {
        return <RailroadWrapper content={props.children as string} />
      }

      return (
        <CodeBlock
          {...props}
          className={{ container: "my-4!" }}
          shouldAnalyze={false}
          shouldFormat={false}
          allowErrors={true}
        />
      )
    },
    Note: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert variant={"note"} className="my-4">
          <BookOpenTextIcon className="w4 h-4" />
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      )
    },
    Warning: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert variant={"warning"} className="my-4">
          <CircleAlertIcon className="w4 h-4" />
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      )
    },
    Advertising: ({
      title,
      children,
    }: {
      title?: string
      children: ReactNode
    }) => {
      if (!title) title = "Werbung!"
      else title = "Werbung: " + title
      return (
        <Alert variant={"advertising"} className="my-4">
          <CoffeeIcon className="w4 h-4" />
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      )
    },
    Success: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert variant={"success"} className="my-4">
          <CircleCheckBigIcon color="#b5ffc9" className="w4 h-4" />
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      )
    },
    Stepper: ({ children }: { children: ReactNode }) => {
      return <Stepper>{children}</Stepper>
    },
    StepperItem: ({
      title,
      children,
    }: {
      title?: string
      children: ReactNode
    }) => {
      return <StepperItem title={title}>{children}</StepperItem>
    },
    Tabs: ({
      defaultValue,
      children,
    }: {
      defaultValue?: string
      children: ReactNode
    }) => <Tabs defaultValue={defaultValue}>{children}</Tabs>,
    TabsTrigger: ({
      value,
      children,
    }: {
      value: string
      children: ReactNode
    }) => <TabsTrigger value={value}>{children}</TabsTrigger>,
    TabsList: ({ children }: { children: ReactNode }) => (
      <TabsList>{children}</TabsList>
    ),
    TabsContent: ({
      value,
      children,
    }: {
      value: string
      children: ReactNode
    }) => <TabsContent value={value}>{children}</TabsContent>,

    table: ({ children }: { children?: ReactNode }) => {
      return (
        <div className="my-4">
          <div className="rounded-md border bg-white dark:border-gray-700 dark:bg-transparent">
            <div className="w-full overflow-auto">
              <Table>{children}</Table>
            </div>
          </div>
        </div>
      )
    },

    thead: ({ children }: { children?: ReactNode }) => {
      return <TableHeader>{children}</TableHeader>
    },
    tbody: ({ children }: { children?: ReactNode }) => {
      return <TableBody>{children}</TableBody>
    },

    th: ({ children }: { children?: ReactNode }) => {
      return <TableHead>{children}</TableHead>
    },

    tr: ({ children }: { children?: ReactNode }) => {
      return <TableRow>{children}</TableRow>
    },

    td: ({ children }: { children?: ReactNode }) => {
      return <TableCell className="whitespace-nowrap">{children}</TableCell>
    },

    dl: ({ children }: { children?: ReactNode }) => {
      return (
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            {children}
          </div>
        </dl>
      )
    },

    dt: ({ children }: { children?: ReactNode }) => {
      return (
        <dt className="text-sm leading-6 font-medium text-primary">
          {children}
        </dt>
      )
    },

    dd: ({ children }: { children?: ReactNode }) => {
      return (
        <dd className="mt-1 text-sm leading-6 text-primary sm:col-span-2 sm:mt-0">
          {children}
        </dd>
      )
    },

    DescriptionList: ({ children }: { children: ReactNode }) => {
      return (
        <dl className="divide-y divide-accent-foreground/15">{children}</dl>
      )
    },

    DescriptionListItem: ({
      label,
      children,
    }: {
      label: string
      children: ReactNode
    }) => {
      return (
        <div className="px-0 py-6 lg:grid lg:grid-cols-3 lg:gap-4">
          <dt className="text-sm leading-6 font-bold text-primary lg:mt-0">
            {label}
          </dt>
          <dd className="mt-1 text-sm leading-6 text-primary lg:col-span-2 lg:mt-0">
            {children}
          </dd>
        </div>
      )
    },
    Preview: ({ children }: { children: ReactNode }) => {
      return <Preview>{children}</Preview>
    },

    Railroad: ({
      content,
      wrapped,
    }: {
      content: string
      wrapped?: boolean
    }) => {
      return <RailroadWrapper content={content} wrapped={wrapped} />
    },

    Mermaid: ({ content, wrapped }: { content: string; wrapped?: boolean }) => {
      return <MermaidWrapper chart={content} wrapped={wrapped} />
    },

    Accordion: ({
      children,
      collapsible,
      orientation,
      type = "single",
    }: {
      children: ReactNode
      collapsible?: boolean
      orientation?: "horizontal" | "vertical"
      type?: "single" | "multiple"
    }) => {
      return (
        <BaseAccordion
          type={type}
          collapsible={collapsible}
          orientation={orientation}
        >
          {children}
        </BaseAccordion>
      )
    },
    AccordionItem: ({
      children,
      title,
    }: {
      children: ReactNode
      title: string
    }) => {
      return (
        <BaseAccordionItem value={createSlug(title)}>
          <BaseAccordionTrigger>{title}</BaseAccordionTrigger>
          <BaseAccordionContent>{children}</BaseAccordionContent>
        </BaseAccordionItem>
      )
    },

    TableBuilder: ({
      columns,
      data,
    }: React.ComponentProps<typeof DataTableBuilder>) => {
      return (
        <DataTableBuilder
          columns={columns}
          data={data}
          options={{ sorting: false, pagination: false }}
        />
      )
    },

    DataTableBuilder: ({
      columns,
      data,
      options,
    }: React.ComponentProps<typeof DataTableBuilder>) => {
      return (
        <DataTableBuilder columns={columns} data={data} options={options} />
      )
    },

    Video: ({ src }: { src: string }) => {
      return <Video src={src} />
    },

    Callout: ({
      title,
      variant = "default",
      children,
    }: {
      title?: string
      variant: VariantProps<typeof alertVariants>["variant"]
      children: ReactNode
    }) => {
      return (
        <Alert variant={variant} className="my-4">
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      )
    },
    Table: Table,
    TableBody: TableBody,
    TableCell: TableCell,
    TableHead: TableHead,
    TableHeader: TableHeader,
    TableRow: TableRow,
  } satisfies MDXComponents
}
