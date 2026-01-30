import { ref, type Ref } from 'vue'
import { compareValues, compareDates } from '../helpers'
import type { SortRule, SortMode, InterfaceTableDataSource, UseTableSortingReturn } from '../types'

/**
 * Composable for managing table sorting logic
 * Handles multi-column sorting with configurable sort modes
 *
 * @param sortRules - Reactive sort rules from URL state
 * @param sortableColumns - Array of column keys that can be sorted
 * @param dateFields - Array of column keys that should be treated as dates
 * @returns Object with sorting state and functions
 */
export function useTableSorting(
  sortRules: Ref<SortRule[]>,
  sortableColumns: string[] = [],
  dateFields: string[] = [],
): UseTableSortingReturn {
  const sortMode = ref<SortMode>('replace')

  /**
   * Handle column header click to toggle sort
   */
  function handleSort(key: string) {
    if (!sortableColumns.includes(key)) return

    const currentRules = [...sortRules.value]
    const idx = currentRules.findIndex((r) => r.key === key)

    if (idx === -1) {
      if (sortMode.value === 'replace') {
        currentRules.unshift({ key, order: 'asc' })
      } else {
        currentRules.push({ key, order: 'asc' })
      }
    } else {
      const cur = currentRules[idx]
      if (!cur) return

      if (cur.order === 'asc') {
        cur.order = 'desc'
      } else {
        currentRules.splice(idx, 1)
      }
    }

    sortRules.value = currentRules
  }

  /**
   * Change the sort mode and reset all sorts
   */
  function handleSortModeChange(newMode: SortMode) {
    if (sortMode.value !== newMode) {
      sortMode.value = newMode
      sortRules.value = []
    }
  }

  /**
   * Clear all active sorts
   */
  function clearAllSorts() {
    sortRules.value = []
  }

  /**
   * Sort data based on active sort rules
   * Applies multi-column sorting in order of rules
   */
  function sortData(data: InterfaceTableDataSource[]): InterfaceTableDataSource[] {
    if (sortRules.value.length === 0) {
      return data
    }

    const arr = [...data]
    arr.sort((a, b) => {
      for (const rule of sortRules.value) {
        const aValue = a[rule.key as keyof typeof a]
        const bValue = b[rule.key as keyof typeof b]

        const res = dateFields.includes(rule.key)
          ? compareDates(aValue, bValue, rule.order)
          : compareValues(aValue, bValue, rule.order)

        if (res !== 0) return res
      }
      return 0
    })

    return arr
  }

  return {
    sortMode,
    sortRules,
    sortData,
    handleSort,
    handleSortModeChange,
    clearAllSorts,
  }
}
