import { resolve as resolvePath } from "path"
import { format as formatUrl, parse as parseUrl } from "url"
import type { UrlObject } from "url"

export interface ResolveHrefOptions {
  currentPath?: string // The current path, useful for resolving relative Hrefs
  locale?: string // The current locale, for prefixing
  defaultLocale?: string // The default locale
  locales?: string[] // A list of all supported locales
  basePath?: string // The base path, if the app is deployed under a subpath
}

/**
 * A simplified standalone implementation of Next.js' `resolveHref`.
 * It resolves a given href into a complete URL, taking into account
 * query parameters, locales, and an optional base path.
 *
 * @param href The URL or URL object to resolve.
 * @param options Options for resolution, e.g., currentPath, locale, basePath.
 * @returns A string representing the fully resolved URL.
 */
export function resolveHref(
  href: string | UrlObject,
  options: ResolveHrefOptions = {},
): string {
  const {
    currentPath = "/",
    locale,
    defaultLocale,
    locales,
    basePath,
  } = options

  let parsedHref: UrlObject

  if (typeof href === "string") {
    parsedHref = parseUrl(href, true) // `true` to parse the query string into an object
  } else {
    parsedHref = { ...href }
  }

  // Resolve path relative to the current path, if `href` is a relative path
  if (parsedHref.pathname && !parsedHref.pathname.startsWith("/")) {
    const currentDirectory = currentPath.substring(
      0,
      currentPath.lastIndexOf("/"),
    )
    parsedHref.pathname = resolvePath(currentDirectory, parsedHref.pathname)
  }

  // Merge query parameters (overwrite existing, add new)
  const baseQueryRaw =
    typeof parsedHref.query === "object" && parsedHref.query !== null
      ? parsedHref.query
      : {}
  const searchQueryRaw = parsedHref.search
    ? parseUrl(`?${parsedHref.search}`, true).query
    : {}
  const normalizeQuery = (
    q: object,
  ): Record<
    string,
    | string
    | number
    | boolean
    | bigint
    | readonly (string | number | boolean | bigint)[]
    | null
    | undefined
  > => {
    const result: Record<
      string,
      | string
      | number
      | boolean
      | bigint
      | readonly (string | number | boolean | bigint)[]
      | null
      | undefined
    > = {}
    for (const [k, v] of Object.entries(q)) {
      if (
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean" ||
        typeof v === "bigint" ||
        v === null ||
        v === undefined
      ) {
        result[k] = v as string | number | boolean | bigint | null | undefined
      } else if (Array.isArray(v)) {
        const arr = v.filter(
          (item): item is string | number | boolean | bigint =>
            typeof item === "string" ||
            typeof item === "number" ||
            typeof item === "boolean" ||
            typeof item === "bigint",
        )
        result[k] = arr as readonly (string | number | boolean | bigint)[]
      } else {
        result[k] = String(v)
      }
    }
    return result
  }
  const baseQuery = normalizeQuery(baseQueryRaw)
  const searchQuery = normalizeQuery(searchQueryRaw)
  const combinedQuery = {
    ...baseQuery,
    ...searchQuery,
  }
  parsedHref.query = combinedQuery
  parsedHref.search = undefined // Remove `search` as `query` is used

  // Locale prefixing
  if (
    locale &&
    locales &&
    locales.includes(locale) &&
    locale !== defaultLocale
  ) {
    // Avoid double locale prefixes if href already starts with the locale
    const localePrefix = `/${locale}`
    if (!parsedHref.pathname?.startsWith(localePrefix)) {
      parsedHref.pathname = `${localePrefix}${parsedHref.pathname === "/" ? "" : parsedHref.pathname}`
    }
  }

  // Add base path
  if (basePath) {
    // Remove leading/trailing slashes for clean concatenation
    const cleanedBasePath = basePath.endsWith("/")
      ? basePath.slice(0, -1)
      : basePath
    const cleanedPathname = parsedHref.pathname?.startsWith("/")
      ? parsedHref.pathname
      : `/${parsedHref.pathname ?? ""}`
    parsedHref.pathname = `${cleanedBasePath}${cleanedPathname}`
  }

  // Ensure the path always starts with a slash if it exists
  if (parsedHref.pathname && !parsedHref.pathname.startsWith("/")) {
    parsedHref.pathname = `/${parsedHref.pathname}`
  }

  // If only a fragment (`#anchor`) was provided
  if (!parsedHref.pathname && parsedHref.hash) {
    // If only a hash is present, we take the current path as base
    parsedHref.pathname = currentPath.split("#")[0]
  }

  return formatUrl(parsedHref)
}
