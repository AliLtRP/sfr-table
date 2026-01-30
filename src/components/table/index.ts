// Component exports
export { default as Table } from './components/Table.vue'
export { default as TablePagination } from './components/TablePagination.vue'

// Composable exports
export { useTableSorting } from './composables/useTableSorting'
export { useTableFiltering } from './composables/useTableFiltering'
export { useTablePagination } from './composables/useTablePagination'
export { useTableUrlState } from './composables/useTableUrlState'

// Type exports
export type {
  InterfaceTableColumn,
  InterfaceTableDataSource,
  SortRule,
  SortMode,
  TableConfig,
  UseTableSortingReturn,
  UseTableFilteringReturn,
  UseTablePaginationReturn,
} from './types'

// Helper function exports
export {
  compareValues,
  compareDates,
  debounce,
  matchesPartial,
  matchesExact,
  matchesRegex,
  createRegexPattern,
} from './helpers'
