import type { TreeItem } from "@/lib/navigation"
import type { LucideProps } from "lucide-react"
import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ChevronRight, GalleryVerticalEnd } from "lucide-react"
import { Link as GitHostLink, Logo as GitHostLogo } from "renoun"

import Link from "./link-component"
import { SearchForm } from "./search-sidebar"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

type RenderIconProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<LucideProps> | { $$typeof: any }
} & React.Attributes &
  LucideProps

function RenderIcon({ icon, ...props }: RenderIconProps) {
  if (!icon) return null
  // Funktionale Komponente
  if (typeof icon === "function") {
    return React.createElement(icon, props)
  }
  // forwardRef-Komponente (Objekt mit $$typeof)
  if (typeof icon === "object" && "$$typeof" in icon) {
    return React.createElement(
      icon as unknown as React.ComponentType<LucideProps>,
      props,
    )
  }
  return null
}

export function DocsSidebar({
  items,
  ...props
}: React.ComponentProps<typeof Sidebar> & { items: TreeItem[] }) {
  const standaloneItems = items.filter(
    (item) => !item.children || item.children.length === 0,
  )
  const groupItems = items.filter(
    (item) => item.children && item.children.length > 0,
  )

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {standaloneItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {standaloneItems.map((item) => {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.externalLink ?? item.path} clean>
                          <RenderIcon
                            icon={item.icon}
                            className="mr-2 h-4 w-4"
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {groupItems.map((item) => {
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>
                <RenderIcon icon={item.icon} className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.children?.map((subItem, index) => (
                    <Tree key={index} item={subItem} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex justify-between">
          <Button variant={"outline"} size="icon" asChild>
            <GitHostLink variant="repository">
              <GitHostLogo variant="gitHost" />
            </GitHostLink>
          </Button>
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function Tree({ item }: { item: TreeItem }) {
  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          className="data-[active=true]:bg-transparent"
          asChild
        >
          <Link clean href={item.externalLink ?? item.path}>
            <RenderIcon icon={item.icon} className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <RenderIcon icon={item.icon} className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 ml-2 pr-0 pl-2">
            {item.children.map((subItem, index) => (
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
