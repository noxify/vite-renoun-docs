// AUTO-GENERATED FILE
      
export type PageProps<T extends string> =
  T extends '/docs/[collection]'
    ? { params: { collection: string }; searchParams?: URLSearchParams }
:  T extends '/docs/[collection]/[...slug]'
    ? { params: { collection: string; slug: string[] }; searchParams?: URLSearchParams }
: never;

export type LayoutProps<T extends string> =
  T extends '/docs/[collection]'
    ? { params: { collection: string }; searchParams?: URLSearchParams }
: never;

