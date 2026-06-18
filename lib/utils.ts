import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for proper
 * Tailwind class precedence.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serialize Appwrite document to plain object for passing to Client Components.
 * Removes all non-serializable properties like methods and class instances.
 */
export function serializeDocument<T extends Record<string, unknown>>(doc: T): T {
  if (!doc || typeof doc !== 'object') return doc

  return JSON.parse(JSON.stringify(doc)) as T
}
