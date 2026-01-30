/**
 * Generic comparison function for sorting values
 * Handles null/undefined values appropriately
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareValues(a: any, b: any, order: 'asc' | 'desc'): number {
  if (a == null && b == null) return 0
  if (a == null) return order === 'asc' ? -1 : 1
  if (b == null) return order === 'asc' ? 1 : -1
  if (a < b) return order === 'asc' ? -1 : 1
  if (a > b) return order === 'asc' ? 1 : -1
  return 0
}

/**
 * Date-specific comparison function
 * Converts date strings/objects to timestamps for comparison
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareDates(a: any, b: any, order: 'asc' | 'desc'): number {
  const dateA = a ? new Date(a).getTime() : null
  const dateB = b ? new Date(b).getTime() : null
  return compareValues(dateA, dateB, order)
}

/**
 * Generic debounce utility function
 * Delays function execution until after the specified delay
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * Check if a value contains the query string (case-insensitive partial match)
 */
export function matchesPartial(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase())
}

/**
 * Check if a value exactly matches the query string (case-insensitive)
 */
export function matchesExact(value: string, query: string): boolean {
  return value.toLowerCase() === query.toLowerCase()
}

/**
 * Check if a value matches a regular expression pattern
 */
export function matchesRegex(value: string, pattern: RegExp): boolean {
  return pattern.test(value)
}

/**
 * Try to compile a regex pattern safely
 * Returns null if the pattern is invalid
 */
export function createRegexPattern(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern, 'gi')
  } catch {
    return null
  }
}
