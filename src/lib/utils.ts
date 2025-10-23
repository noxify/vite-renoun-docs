import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeFromArray<T>(array: T[], valueToRemove: T[]): T[] {
  return array.filter((value) => !valueToRemove.includes(value))
}
