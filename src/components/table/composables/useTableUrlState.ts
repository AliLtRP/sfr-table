import { useRouteQuery } from '@vueuse/router'
import { computed, watch } from 'vue'
import type { SortRule } from '../types'

export function useTableUrlState() {
  const searchQuery = useRouteQuery('search', '')
  const currentPage = useRouteQuery('page', '1', {
    transform: (v) => Number(v) || 1,
  })
  const rowsPerPage = useRouteQuery('pageSize', '10', {
    transform: (v) => Number(v) || 10,
  })

  const sortParam = useRouteQuery<string>('sort', '')

  const sortRules = computed<SortRule[]>({
    get() {
      const param = sortParam.value
      if (!param || typeof param !== 'string') return []

      return param
        .split(',')
        .map((rule) => {
          const [key, order] = rule.split(':')
          if (key && (order === 'asc' || order === 'desc')) {
            return { key, order }
          }
          return null
        })
        .filter((rule): rule is SortRule => rule !== null)
    },
    set(newRules: SortRule[]) {
      if (newRules.length === 0) {
        sortParam.value = ''
      } else {
        sortParam.value = newRules.map((r) => `${r.key}:${r.order}`).join(',')
      }
    },
  })

  watch(currentPage, (val) => {
    if (val < 1) {
      currentPage.value = 1
    }
  })

  watch(rowsPerPage, (val) => {
    if (val < 1) {
      rowsPerPage.value = 10
    }
  })

  return {
    searchQuery,
    sortRules,
    currentPage,
    rowsPerPage,
  }
}
