import { ref, watch, type Ref } from 'vue'
import { matchesPartial, matchesExact, matchesRegex, createRegexPattern } from '../helpers'
import type { InterfaceTableDataSource, UseTableFilteringReturn } from '../types'

/**
 * Composable for managing table filtering/search logic
 * Implements debounced search with multiple matching modes
 *
 * @param searchQuery - Reactive search query from URL state
 * @param searchableFields - Array of field keys to search in
 * @returns Object with filtering state and functions
 */
export function useTableFiltering(
  searchQuery: Ref<string>,
  searchableFields: string[] = [],
): UseTableFilteringReturn {
  const debouncedQuery = ref('')

  let timer: ReturnType<typeof setTimeout> | null = null

  watch(
    searchQuery,
    (val) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        debouncedQuery.value = val
      }, 500)
    },
    { immediate: true },
  )

  /**
   * Filter data based on search query
   * Tries multiple matching modes: partial, exact, and regex
   */
  function filterData(data: InterfaceTableDataSource[]): InterfaceTableDataSource[] {
    const query = debouncedQuery.value
    const trimmed = query.trim()

    if (!trimmed) {
      return data
    }

    const regexPattern = createRegexPattern(trimmed)

    return data.filter((row) => {
      const fields = searchableFields.map((field) => String(row[field] || ''))

      return fields.some((fieldValue) => {
        if (matchesPartial(fieldValue, trimmed)) return true

        if (matchesExact(fieldValue, trimmed)) return true

        if (regexPattern && matchesRegex(fieldValue, regexPattern)) return true

        return false
      })
    })
  }

  return {
    searchQuery,
    debouncedQuery,
    filterData,
  }
}
