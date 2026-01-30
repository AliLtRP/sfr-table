import type { HTMLAttributes } from 'vue'
import type { Ref } from 'vue'

export interface InterfaceTableColumn {
  key: string
  title: string
  dataIndex: string
  className?: HTMLAttributes['class']
}

export interface InterfaceTableDataSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

/**
 * Sort rule defining how a column should be sorted
 */
export interface SortRule {
  key: string
  order: 'asc' | 'desc'
}

/**
 * Sort mode type - how new sort columns are handled
 * - 'replace': new column becomes primary sort (clears others)
 * - 'add': new column is added as secondary sort (within groups)
 */
export type SortMode = 'replace' | 'add'

/**
 * Configuration object for table behavior
 */
export interface TableConfig {
  sortableColumns: string[]
  searchableFields: string[]
  dateFields?: string[]
}

/**
 * Return type for useTableSorting composable
 */
export interface UseTableSortingReturn {
  sortMode: Ref<SortMode>
  sortRules: Ref<SortRule[]>
  sortData: (data: InterfaceTableDataSource[]) => InterfaceTableDataSource[]
  handleSort: (key: string) => void
  handleSortModeChange: (newMode: SortMode) => void
  clearAllSorts: () => void
}

/**
 * Return type for useTableFiltering composable
 */
export interface UseTableFilteringReturn {
  searchQuery: Ref<string>
  debouncedQuery: Ref<string>
  filterData: (data: InterfaceTableDataSource[]) => InterfaceTableDataSource[]
}

/**
 * Return type for useTablePagination composable
 */
export interface UseTablePaginationReturn {
  currentPage: Ref<number>
  rowsPerPage: Ref<number>
  totalItems: Ref<number>
  paginateData: (data: InterfaceTableDataSource[]) => InterfaceTableDataSource[]
  handlePageChange: (page: number) => void
  handlePageSizeChange: (size: number) => void
}
